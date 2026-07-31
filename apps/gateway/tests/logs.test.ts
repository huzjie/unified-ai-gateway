import { makeTestRuntime } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';

describe('logs & stats API', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    server = await createTestServer(runtime);
    const login = await server.inject({
      method: 'POST',
      url: '/admin/auth/login',
      payload: { username: 'admin', password: 'test-password-123' },
    });
    token = login.json().data.token;

    // 制造一条日志
    runtime.logService.recordLog({
      requestId: 'req-test-1', keyId: 'key-1', tenant: 'test', model: 'mock-all',
      provider: 'mock', providerModel: 'mock-all', statusCode: 200, latencyMs: 42,
      promptTokens: 10, completionTokens: 5, totalTokens: 15, costAmount: 100,
      currency: 'CNY', stream: false, cacheHit: false, errorCode: null, errorMessage: null,
    });
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('查询日志', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/admin/logs',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.total).toBeGreaterThanOrEqual(1);
  });

  it('统计聚合', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/admin/stats?dimension=model',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.data.length).toBeGreaterThanOrEqual(1);
  });

  it('仪表盘', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/admin/dashboard',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.metrics.totalRequests).toBeGreaterThanOrEqual(1);
  });
});
