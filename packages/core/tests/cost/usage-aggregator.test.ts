import { UsageAggregator } from '../../src/cost';
import type { UsageLog } from '@uag/types';

function makeLog(overrides: Partial<UsageLog> = {}): UsageLog {
  return {
    id: 'l', requestId: 'r', keyId: 'k1', tenant: 't', model: 'm1', provider: 'p1',
    providerModel: 'm1', statusCode: 200, latencyMs: 100, promptTokens: 10,
    completionTokens: 5, totalTokens: 15, costAmount: 100, currency: 'CNY',
    stream: false, cacheHit: false, errorCode: null, errorMessage: null,
    createdAt: '2026-07-31T10:00:00.000Z', ...overrides,
  };
}

describe('UsageAggregator', () => {
  it('按模型聚合', () => {
    const agg = new UsageAggregator();
    const logs = [makeLog({ model: 'a' }), makeLog({ model: 'a' }), makeLog({ model: 'b', statusCode: 500 })];
    const result = agg.byModel(logs);
    expect(result.length).toBe(2);
    const a = result.find((r) => r.key === 'a')!;
    expect(a.requestCount).toBe(2);
    expect(a.successCount).toBe(2);
    expect(a.totalTokens).toBe(30);
  });

  it('按 Key / Provider / 日期聚合', () => {
    const agg = new UsageAggregator();
    const logs = [makeLog({ keyId: 'k1' }), makeLog({ keyId: 'k2' }), makeLog({ createdAt: '2026-07-30T01:00:00.000Z' })];
    expect(agg.byKey(logs).length).toBe(2);
    expect(agg.byProvider(logs).length).toBe(1);
    expect(agg.byDate(logs).length).toBe(2);
    expect(agg.byHour(logs).length).toBe(2);
  });
});
