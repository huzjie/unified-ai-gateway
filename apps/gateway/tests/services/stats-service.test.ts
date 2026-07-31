import { makeTestRuntime } from '../helpers/test-fixtures';

describe('StatsService', () => {
  it('聚合空数据', async () => {
    const runtime = await makeTestRuntime();
    expect(runtime.statsService.aggregate('model')).toEqual([]);
    expect(runtime.statsService.hourly()).toEqual([]);
    await runtime.shutdown();
  });

  it('聚合有数据', async () => {
    const runtime = await makeTestRuntime();
    runtime.logService.recordLog({
      requestId: 'r2', keyId: 'k1', tenant: 't', model: 'mock-all', provider: 'mock',
      providerModel: 'mock-all', statusCode: 200, latencyMs: 5,
      promptTokens: 10, completionTokens: 5, totalTokens: 15, costAmount: 100,
      currency: 'CNY', stream: false, cacheHit: false, errorCode: null, errorMessage: null,
    });
    const byModel = runtime.statsService.aggregate('model');
    expect(byModel.length).toBe(1);
    expect(byModel[0].requestCount).toBe(1);
    expect(runtime.statsService.hourly().length).toBe(1);
    await runtime.shutdown();
  });
});
