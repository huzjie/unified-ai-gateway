import { AggregationUtils } from '../src/utils/aggregation-utils';
import type { UsageLog } from '@uag/types';

function makeLog(overrides: Partial<UsageLog> = {}): UsageLog {
  return {
    id: `l-${Math.random()}`, requestId: 'r', keyId: 'k1', tenant: 't', model: 'm1',
    provider: 'p1', providerModel: 'm1', statusCode: 200, latencyMs: 100,
    promptTokens: 10, completionTokens: 5, totalTokens: 15, costAmount: 100,
    currency: 'CNY', stream: false, cacheHit: false, errorCode: null, errorMessage: null,
    createdAt: '2026-07-31T10:00:00.000Z', ...overrides,
  };
}

describe('AggregationUtils', () => {
  it('按模型聚合', () => {
    const utils = new AggregationUtils();
    const logs = [makeLog({ model: 'a' }), makeLog({ model: 'a' }), makeLog({ model: 'b', statusCode: 500 })];
    const result = utils.aggregate(logs, 'model');
    expect(result.length).toBe(2);
    const a = result.find((r) => r.dimension === 'a')!;
    expect(a.request_count).toBe(2);
    expect(a.total_tokens).toBe(30);
  });

  it('按 key 聚合', () => {
    const utils = new AggregationUtils();
    const logs = [makeLog({ keyId: 'k1' }), makeLog({ keyId: 'k2' })];
    expect(utils.aggregate(logs, 'key').length).toBe(2);
  });

  it('按日期聚合', () => {
    const utils = new AggregationUtils();
    const logs = [makeLog({ createdAt: '2026-07-30T01:00:00.000Z' }), makeLog({ createdAt: '2026-07-31T01:00:00.000Z' })];
    const result = utils.aggregate(logs, 'date');
    expect(result.map((r) => r.dimension).sort()).toEqual(['2026-07-30', '2026-07-31']);
  });
});
