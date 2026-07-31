import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';
import { MockProvider } from '@uag/providers';
import { ErrorCode } from '@uag/core';

describe('integration: failover flow', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    const failing = new MockProvider({ name: 'mock-fail', options: { failureRate: 1, failureCode: ErrorCode.PROVIDER_UNAVAILABLE } });
    runtime.providers.register(failing);
    runtime.repos.routeRule.create({
      name: 'fover', priority: 1, matchModel: 'fover-model', matchTenant: null,
      strategy: 'priority', targets: ['mock-fail', 'mock'], fallbackTargets: [], enabled: true,
    });
    runtime.reloadRouteRules();
    server = await createTestServer(runtime);
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('故障转移成功后响应头可见', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'fover-model', messages: [{ role: 'user', content: 'hi' }] },
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['x-uag-provider']).toBe('mock');
  });
});
