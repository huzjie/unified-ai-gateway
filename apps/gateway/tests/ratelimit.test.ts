import { makeTestRuntime } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';

describe('ratelimit flow', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;
  let plainKey: string;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    // 低 QPS Key
    const { KeyHasher, KeyGenerator } = require('@uag/storage');
    const { plain, keyPrefix } = KeyGenerator.generate('low');
    const { salt, hash } = KeyHasher.hash(plain);
    runtime.repos.apiKey.create({
      name: 'low-qps', tenant: 'test', keyHash: KeyHasher.combine(salt, hash), salt, keyPrefix,
      modelWhitelist: [], qpsLimit: 1, concurrencyLimit: 10,
    });
    runtime.keyHashIndex.set(plain, KeyHasher.combine(salt, hash));
    plainKey = plain;
    server = await createTestServer(runtime);
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('超 QPS 返回 429 + Retry-After', async () => {
    const inject = () =>
      server.inject({
        method: 'POST',
        url: '/v1/chat/completions',
        headers: { authorization: `Bearer ${plainKey}` },
        payload: { model: 'mock-all', messages: [{ role: 'user', content: 'x' }] },
      });
    // token-bucket：burst = qpsLimit * 2，qpsLimit=1 时第 3 个请求触发限流
    await inject();
    await inject();
    const third = await inject();
    expect(third.statusCode).toBe(429);
    expect(third.json().error.code).toBe('UAG-3001');
    expect(Number(third.headers['retry-after'])).toBeGreaterThan(0);
  });
});
