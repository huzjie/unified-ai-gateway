import { makeTestRuntime } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';

describe('streaming API', () => {
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

  it('流式返回 SSE 帧', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'hello stream' }], stream: true },
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/event-stream');
    expect(res.body).toContain('data:');
    expect(res.body).toContain('[DONE]');
  });
});
