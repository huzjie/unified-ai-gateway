import { makeTestRuntime, makeTestConfig } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';

describe('models API', () => {
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

  it('GET /v1/models 返回模型清单', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/models',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.object).toBe('list');
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('未鉴权返回 401', async () => {
    const res = await server.inject({ method: 'GET', url: '/v1/models' });
    expect(res.statusCode).toBe(401);
  });
});
