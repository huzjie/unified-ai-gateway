import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';

describe('export service', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    runtime.logService.recordLog({
      requestId: 'exp1', keyId: 'k1', tenant: 't', model: 'mock-all', provider: 'mock',
      providerModel: 'mock-all', statusCode: 200, latencyMs: 10,
      promptTokens: 1, completionTokens: 1, totalTokens: 2, costAmount: 0,
      currency: 'CNY', stream: false, cacheHit: false, errorCode: null, errorMessage: null,
    });
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

  it('导出 CSV 含表头与数据', async () => {
    const res = await server.inject({
      method: 'GET', url: '/admin/export/csv',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain('时间');
    expect(res.body).toContain('mock-all');
  });
});
