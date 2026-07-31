import { makeTestRuntime, makeTestConfig } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';

describe('chat API', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    server = await createTestServer(runtime);
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('无 Key 返回 401', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'hi' }] },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().error.code).toBe('UAG-2001');
  });

  it('有效 Key 返回 200 与响应', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'hello' }] },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.object).toBe('chat.completion');
    expect(body.choices[0].message.content).toContain('[mock:mock-all]');
    expect(body.usage.total_tokens).toBeGreaterThan(0);
  });

  it('缺少 messages 返回 400', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'mock-all' },
    });
    expect(res.statusCode).toBe(400);
  });
});
