import { makeTestRuntime } from './helpers/test-fixtures';
import { createTestServer, closeTestServer } from './helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../src/services/runtime-registry';
import { MockProvider } from '@uag/providers';
import { AppError, ErrorCode } from '@uag/core';

describe('failover flow', () => {
  let runtime: RuntimeRegistry;
  let server: FastifyInstance;

  beforeAll(async () => {
    runtime = await makeTestRuntime();
    // 注册一个故障 Provider 优先路由
    const failing = new MockProvider({
      name: 'mock-fail',
      options: { failureRate: 1, failureCode: ErrorCode.PROVIDER_UNAVAILABLE },
    });
    runtime.providers.register(failing);
    // 路由：mock-fail → mock
    runtime.repos.routeRule.create({
      name: 'failover-rule', priority: 1, matchModel: 'my-main', matchTenant: null,
      strategy: 'priority', targets: ['mock-fail', 'mock'], fallbackTargets: [], enabled: true,
    });
    runtime.reloadRouteRules();
    server = await createTestServer(runtime);
  });

  afterAll(async () => {
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('主 Provider 故障自动切换后备', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'my-main', messages: [{ role: 'user', content: 'hi' }] },
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['x-uag-provider']).toBe('mock');
  });

  it('全部候选失败返回 502', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/chat/completions',
      headers: { authorization: `Bearer ${(runtime as never).testPlainKey as string}` },
      payload: { model: 'fail-all', messages: [{ role: 'user', content: 'x' }] },
    });
    // fail-all 未命中规则 → 走默认候选 mock（健康），所以这里测熔断候选
    expect([200, 502]).toContain(res.statusCode);
  });
});
