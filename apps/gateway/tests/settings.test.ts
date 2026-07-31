import { makeTestRuntime } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';

describe('settings & audit API', () => {
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

  it('读取设置', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/admin/settings',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.globalQps).toBe(1000);
  });

  it('更新设置', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: '/admin/settings',
      headers: { authorization: `Bearer ${token}` },
      payload: { globalQps: 500 },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.globalQps).toBe(500);
  });

  it('审计日志查询（登录操作被记录）', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/admin/audit',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.total).toBeGreaterThanOrEqual(1);
  });

  it('CSV 导出', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/admin/export/csv',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
  });
});
