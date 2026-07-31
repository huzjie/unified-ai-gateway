import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';
import { KeyHasher, KeyGenerator } from '@uag/storage';

describe('integration: ratelimit flow', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;
  let lowKey: string;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    const { plain, keyPrefix } = KeyGenerator.generate('low');
    const { salt, hash } = KeyHasher.hash(plain);
    runtime.repos.apiKey.create({
      name: 'low', tenant: 'test', keyHash: KeyHasher.combine(salt, hash), salt, keyPrefix,
      modelWhitelist: [], qpsLimit: 1, concurrencyLimit: 10,
    });
    runtime.keyHashIndex.set(plain, KeyHasher.combine(salt, hash));
    lowKey = plain;
    server = await createTestServer(runtime);
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('第三个请求被限流（burst=2×qps）', async () => {
    const opts = {
      method: 'POST' as const,
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${lowKey}` },
      payload: { model: 'mock-all', messages: [{ role: 'user', content: 'x' }] },
    };
    await server.inject(opts);
    await server.inject(opts);
    const third = await server.inject(opts);
    expect(third.statusCode).toBe(429);
    expect(third.json().error.code).toBe('UAG-3001');
  });
});
