import { makeTestRuntime } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';

describe('routes API', () => {
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
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('创建路由规则', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/admin/routes',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'main-chat', matchModel: 'my-main', strategy: 'priority', targets: ['mock'] },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().data.strategy).toBe('priority');
  });

  it('干跑路由决策', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/admin/routes/dry-run',
      headers: { authorization: `Bearer ${token}` },
      payload: { model: 'my-main', tenant: 'test' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.matched).toBeTruthy();
  });
});
