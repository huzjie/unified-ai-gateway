import { makeTestRuntime } from '../helpers/test-fixtures';

describe('DashboardService', () => {
  it('空数据仪表盘', async () => {
    const runtime = await makeTestRuntime();
    const data = runtime.dashboardService.get(7);
    expect(data.metrics.successRate).toBe(100);
    expect(Array.isArray(data.trend)).toBe(true);
    expect(Array.isArray(data.modelShare)).toBe(true);
    await runtime.shutdown();
  });

  it('有日志后指标计数', async () => {
    const runtime = await makeTestRuntime();
    runtime.logService.recordLog({
      requestId: 'r1', keyId: null, tenant: 't', model: 'mock-all', provider: 'mock',
      providerModel: 'mock-all', statusCode: 200, latencyMs: 10,
      promptTokens: 1, completionTokens: 1, totalTokens: 2, costAmount: 0,
      currency: 'CNY', stream: false, cacheHit: false, errorCode: null, errorMessage: null,
    });
    const data = runtime.dashboardService.get(7);
    expect(data.metrics.totalRequests).toBeGreaterThanOrEqual(1);
    await runtime.shutdown();
  });
});
