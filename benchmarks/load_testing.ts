/**
 * 压测脚本：并发请求 + 故障注入
 * 运行：pnpm --filter @uag/gateway tsx ../../benchmarks/load_testing.ts
 */
import { makeTestRuntime } from '../apps/gateway/tests/helpers/test-fixtures';
import { createTestServer } from '../apps/gateway/tests/helpers/test-server';
import { MockProvider } from '@uag/providers';
import { ErrorCode } from '@uag/core';

async function main(): Promise<void> {
  const runtime = await makeTestRuntime();
  // 注入 20% 故障的 Provider
  const flaky = new MockProvider({
    name: 'mock-flaky',
    options: { failureRate: 0.2, failureCode: ErrorCode.PROVIDER_UNAVAILABLE },
  });
  runtime.providers.register(flaky);
  runtime.repos.routeRule.create({
    name: 'load-rule', priority: 1, matchModel: 'load-model', matchTenant: null,
    strategy: 'priority', targets: ['mock-flaky', 'mock'], fallbackTargets: [], enabled: true,
  });
  runtime.reloadRouteRules();
  const server = await createTestServer(runtime);
  const plainKey = (runtime as never).testPlainKey as string;

  const results = await Promise.allSettled(
    Array.from({ length: 100 }, async (_, i) => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/chat/completions',
        headers: { authorization: `Bearer ${plainKey}` },
        payload: { model: 'load-model', messages: [{ role: 'user', content: `load ${i}` }] },
      });
      return res.statusCode;
    }),
  );

  const statuses = results.filter((r) => r.status === 'fulfilled').map((r) => (r as PromiseFulfilledResult<number>).value);
  const ok = statuses.filter((s) => s === 200).length;

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    requests: 100,
    ok: ok,
    errors: 100 - ok,
    failoverWorking: ok > 50, // 故障转移保证大部分成功
  }));

  await server.close();
  await runtime.shutdown();
}

void main();
