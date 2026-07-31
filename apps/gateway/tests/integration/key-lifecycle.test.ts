import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';

describe('integration: key lifecycle', () => {
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

  it('创建→使用→吊销', async () => {
    const created = await server.inject({
      method: 'POST', url: '/admin/keys',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'lifecycle', tenant: 'life', qpsLimit: 100 },
    });
    const plain = created.json().data.plainKey;
    expect(plain).toMatch(/^sk-live-/);

    // 使用新 Key 调 chat
    const chat = await server.inject({
      method: 'POST', url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${plain}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'hi' }] },
    });
    expect(chat.statusCode).toBe(200);

    // 吊销
    const id = created.json().data.key.id;
    await server.inject({
      method: 'DELETE', url: `/admin/keys/${id}`,
      headers: { authorization: `Bearer ${token}` },
    });

    // 吊销后不可用
    const revoked = await server.inject({
      method: 'POST', url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${plain}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'hi' }] },
    });
    expect(revoked.statusCode).toBe(403);
  });
});
