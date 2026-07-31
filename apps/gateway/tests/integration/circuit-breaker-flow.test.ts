import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';
import { MockProvider } from '@uag/providers';
import { ErrorCode } from '@uag/core';

describe('integration: circuit breaker flow', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    // 低阈值熔断配置
    runtime.breaker.resetAll();
    // 连续失败 Provider
    const failing = new MockProvider({ name: 'cb-fail', options: { failureRate: 1, failureCode: ErrorCode.PROVIDER_UNAVAILABLE } });
    runtime.providers.register(failing);
    runtime.repos.routeRule.create({
      name: 'cb-rule', priority: 1, matchModel: 'cb-model', matchTenant: null,
      strategy: 'priority', targets: ['cb-fail', 'mock'], fallbackTargets: [], enabled: true,
    });
    runtime.reloadRouteRules();
    server = await createTestServer(runtime);
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('连续失败后熔断并故障转移', async () => {
    const opts = {
      method: 'POST' as const,
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'cb-model', messages: [{ role: 'user', content: 'x' }] },
    };
    // 多次请求触发熔断（minRequests=10）
    for (let i = 0; i < 12; i++) {
      await server.inject(opts);
    }
    const state = runtime.breaker.getState('cb-fail');
    expect(['OPEN', 'HALF_OPEN']).toContain(state);
    // 请求仍成功（故障转移到 mock）
    const res = await server.inject(opts);
    expect(res.statusCode).toBe(200);
  });
});
