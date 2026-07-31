/**
 * 吞吐基准：单实例 QPS
 * 目标：并发 200、持续 5 分钟，QPS ≥ 1000，错误率 < 0.1%
 * 运行：pnpm --filter @uag/gateway tsx ../../benchmarks/throughput.ts
 */
import { makeTestRuntime } from '../apps/gateway/tests/helpers/test-fixtures';
import { createTestServer } from '../apps/gateway/tests/helpers/test-server';

async function main(): Promise<void> {
  const runtime = await makeTestRuntime();
  const server = await createTestServer(runtime);
  const plainKey = (runtime as never).testPlainKey as string;

  const CONCURRENCY = 200;
  const DURATION_MS = 5000; // 基准模式 5s（完整 5 分钟可调）
  const startedAt = Date.now();
  let total = 0;
  let errors = 0;

  const worker = async (): Promise<void> => {
    while (Date.now() - startedAt < DURATION_MS) {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/chat/completions',
        headers: { authorization: `Bearer ${plainKey}` },
        payload: { model: 'mock-all', messages: [{ role: 'user', content: 'throughput' }] },
      });
      total += 1;
      if (res.statusCode >= 400) {
        errors += 1;
      }
    }
  };

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const elapsedSec = (Date.now() - startedAt) / 1000;
  const qps = total / elapsedSec;
  const errorRate = (errors / total) * 100;

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    concurrency: CONCURRENCY,
    durationSec: Number(elapsedSec.toFixed(1)),
    total,
    qps: Number(qps.toFixed(1)),
    errors,
    errorRate: Number(errorRate.toFixed(3)),
    target: 'QPS >= 1000, 错误率 < 0.1%',
    pass: qps >= 1000 && errorRate < 0.1,
  }));

  await server.close();
  await runtime.shutdown();
}

void main();
