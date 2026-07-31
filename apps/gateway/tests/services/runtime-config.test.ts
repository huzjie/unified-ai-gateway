import { RuntimeConfig } from '../../src/config/runtime-config';

describe('RuntimeConfig', () => {
  const base = {
    defaultTimeoutMs: 30000, defaultMaxRetries: 2, breakerFailureThreshold: 0.5,
    breakerMinRequests: 10, breakerOpenMs: 30000, globalQps: 1000, globalConcurrency: 200,
    webhookUrl: null, alertRateLimited: false, alertCircuitOpen: false, alertQuotaExceeded: false,
    logRetentionDays: 30, cacheEnabled: false, updatedAt: new Date().toISOString(),
  };

  it('读取与热更新', () => {
    const runtime = new RuntimeConfig(base);
    expect(runtime.get().globalQps).toBe(1000);
    const updated = runtime.update({ globalQps: 500 });
    expect(updated.globalQps).toBe(500);
    expect(runtime.get().globalQps).toBe(500);
  });

  it('replace 覆盖', () => {
    const runtime = new RuntimeConfig(base);
    runtime.replace({ ...base, globalQps: 200 });
    expect(runtime.get().globalQps).toBe(200);
  });
});
