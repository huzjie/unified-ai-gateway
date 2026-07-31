import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';

describe('integration: chat flow', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    server = await createTestServer(runtime);
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('完整 chat 流程：鉴权→路由→代理→日志', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'integration test' }] },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain('mock:mock-all');

    // 日志已落库
    const logs = runtime.repos.usageLog.query({}, { page: 1, pageSize: 10 });
    expect(logs.total).toBeGreaterThanOrEqual(1);

    // 日统计已聚合
    const stats = runtime.repos.dailyStats.findByDate(new Date().toISOString().slice(0, 10));
    expect(stats.length).toBeGreaterThanOrEqual(1);
  });
});
