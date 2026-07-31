import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';

describe('integration: stream flow', () => {
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

  it('流式响应完整帧序列', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'stream' }], stream: true },
    });
    expect(res.statusCode).toBe(200);
    const frames = res.body.split('\n\n').filter((f) => f.startsWith('data:'));
    expect(frames.length).toBeGreaterThan(2);
    expect(frames[frames.length - 1]).toContain('[DONE]');
  });
});
