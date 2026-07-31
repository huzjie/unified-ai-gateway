import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';

describe('integration: provider config flow', () => {
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

  it('Provider 配置→测试→使用', async () => {
    const created = await server.inject({
      method: 'POST', url: '/admin/providers',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'mock-prod-2', type: 'mock', baseUrl: 'mock://2' },
    });
    expect(created.statusCode).toBe(201);

    // 路由到新 Provider
    await server.inject({
      method: 'POST', url: '/admin/routes',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'mock2-route', matchModel: 'm2', targets: ['mock-prod-2'] },
    });

    // 测试连接
    const id = created.json().data.id;
    const tested = await server.inject({
      method: 'POST', url: `/admin/providers/${id}/test`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(tested.json().data.ok).toBe(true);

    // 使用
    const chat = await server.inject({
      method: 'POST', url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'm2', messages: [{ role: 'user', content: 'hi' }] },
    });
    expect(chat.statusCode).toBe(200);
  });
});
