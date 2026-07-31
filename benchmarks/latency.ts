/**
 * 延迟基准：网关代理开销
 * 目标：P99 网关开销 < 5ms（不含上游调用）
 * 运行：pnpm --filter @uag/gateway tsx ../../benchmarks/latency.ts
 */
import { makeTestRuntime } from '../apps/gateway/tests/helpers/test-fixtures';
import { createTestServer } from '../apps/gateway/tests/helpers/test-server';

async function main(): Promise<void> {
  const runtime = await makeTestRuntime();
  const server = await createTestServer(runtime);
  const plainKey = (runtime as never).testPlainKey as string;

  // 预热
  for (let i = 0; i < 50; i++) {
    await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${plainKey}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'warmup' }] },
    });
  }

  const latencies: number[] = [];
  for (let i = 0; i < 500; i++) {
    const start = process.hrtime.bigint();
    await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${plainKey}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: `bench ${i}` }] },
    });
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    latencies.push(elapsedMs);
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    requests: latencies.length,
    avgMs: Number(avg.toFixed(2)),
    p50Ms: Number(p50.toFixed(2)),
    p99Ms: Number(p99.toFixed(2)),
    target: 'P99 < 5ms',
    pass: p99 < 5,
  }));

  await server.close();
  await runtime.shutdown();
}

void main();
