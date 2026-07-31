import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';

describe('integration: route rule flow', () => {
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

  it('租户匹配路由生效', async () => {
    // 为租户 data 配置路由指向 mock
    await server.inject({
      method: 'POST', url: '/admin/routes',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'data-route', matchTenant: 'test', strategy: 'priority', targets: ['mock'] },
    });

    const chat = await server.inject({
      method: 'POST', url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'route' }] },
    });
    expect(chat.statusCode).toBe(200);
    expect(chat.headers['x-uag-provider']).toBe('mock');
  });
});
