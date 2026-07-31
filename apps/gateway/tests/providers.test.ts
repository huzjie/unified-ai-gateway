import { makeTestRuntime } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';

describe('providers API', () => {
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

  it('添加 Provider', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/admin/providers',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'deepseek-test', type: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', apiKey: 'sk-test' },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().data.name).toBe('deepseek-test');
  });

  it('重复名称返回 400', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/admin/providers',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'mock', type: 'mock', baseUrl: 'mock://x' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('列表包含 Provider', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/admin/providers',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.total).toBeGreaterThanOrEqual(2);
  });
});
