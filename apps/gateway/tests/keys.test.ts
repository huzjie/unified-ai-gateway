import { makeTestRuntime } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';

describe('keys API', () => {
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

  it('未登录返回 401', async () => {
    const res = await server.inject({ method: 'GET', url: '/admin/keys' });
    expect(res.statusCode).toBe(401);
  });

  it('创建 Key 返回明文一次', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/admin/keys',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'data-team', tenant: 'data', qpsLimit: 50 },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.data.plainKey).toMatch(/^sk-live-/);
  });

  it('列表包含创建的 Key', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/admin/keys',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.total).toBeGreaterThanOrEqual(2);
  });

  it('吊销 Key', async () => {
    const list = await server.inject({
      method: 'GET',
      url: '/admin/keys',
      headers: { authorization: `Bearer ${token}` },
    });
    const first = list.json().data.items[0];
    const res = await server.inject({
      method: 'DELETE',
      url: `/admin/keys/${first.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.revoked).toBe(true);
  });
});
