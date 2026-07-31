import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';

describe('integration: cost flow', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    server = await createTestServer(runtime);
    const login = await server.inject({
      method: 'POST', url: '/admin/auth/login',
      payload: { username: 'admin', password: 'test-password-123' },
    });
    token = login.json().data.token;
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('请求后成本写入日志与统计', async () => {
    const chat = await server.inject({
      method: 'POST', url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'cost test' }] },
    });
    expect(chat.statusCode).toBe(200);

    const logs = runtime.repos.usageLog.query({ model: 'mock-all' }, { page: 1, pageSize: 10 });
    expect(logs.total).toBeGreaterThanOrEqual(1);
    expect(logs.items[0].costAmount).toBeGreaterThanOrEqual(0);
    expect(logs.items[0].currency).toBe('CNY');

    // 仪表盘成本可见
    const dash = await server.inject({
      method: 'GET', url: '/admin/dashboard',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(dash.json().data.metrics.totalRequests).toBeGreaterThanOrEqual(1);
  });
});
