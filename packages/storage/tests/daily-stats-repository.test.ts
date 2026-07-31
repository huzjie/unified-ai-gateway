import { StorageFactory } from '../src/factory/storage-factory';

describe('DailyStatsRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('upsert 合并统计', () => {
    const repo = factory.repos.dailyStats;
    repo.upsert({
      statDate: '2026-07-31', keyId: 'k1', model: 'kimi', provider: 'moonshot',
      requestCount: 3, successCount: 2, errorCount: 1, rateLimitedCount: 0,
      promptTokens: 300, completionTokens: 150, totalTokens: 450, costAmount: 500,
      avgLatencyMs: 100, p95LatencyMs: 200,
    });
    repo.upsert({
      statDate: '2026-07-31', keyId: 'k1', model: 'kimi', provider: 'moonshot',
      requestCount: 2, successCount: 2, errorCount: 0, rateLimitedCount: 1,
      promptTokens: 200, completionTokens: 100, totalTokens: 300, costAmount: 300,
      avgLatencyMs: 80, p95LatencyMs: 150,
    });
    const rows = repo.findByDate('2026-07-31');
    expect(rows.length).toBe(1);
    expect(rows[0].requestCount).toBe(5);
    expect(rows[0].costAmount).toBe(800);
    expect(rows[0].totalTokens).toBe(750);
  });

  it('aggregateFromLogs 从 usage_logs 聚合', () => {
    const logs = factory.repos.usageLog;
    for (let i = 0; i < 4; i++) {
      logs.insert({
        id: `l${i}`, requestId: `r${i}`, keyId: 'k1', tenant: 't', model: 'm1', provider: 'p1',
        providerModel: 'm1', statusCode: i === 3 ? 500 : 200, latencyMs: 100,
        promptTokens: 100, completionTokens: 50, totalTokens: 150, costAmount: 100,
        currency: 'CNY', stream: false, cacheHit: false, errorCode: null, errorMessage: null,
        createdAt: '2026-07-31T10:00:00.000Z',
      });
    }
    factory.repos.dailyStats.aggregateFromLogs('2026-07-31');
    const rows = factory.repos.dailyStats.findByDate('2026-07-31');
    expect(rows.length).toBe(1);
    expect(rows[0].requestCount).toBe(4);
    expect(rows[0].successCount).toBe(3);
    expect(rows[0].errorCount).toBe(1);
  });
});
