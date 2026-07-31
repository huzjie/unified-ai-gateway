import { StorageFactory } from '../src/factory/storage-factory';
import type { UsageLog } from '@uag/types';

function makeLog(overrides: Partial<UsageLog> = {}): UsageLog {
  return {
    id: `log-${Math.random()}`,
    requestId: `req-${Math.random()}`,
    keyId: 'key-1',
    tenant: 'data',
    model: 'kimi-k3',
    provider: 'moonshot',
    providerModel: 'kimi-k3',
    statusCode: 200,
    latencyMs: 120,
    promptTokens: 100,
    completionTokens: 50,
    totalTokens: 150,
    costAmount: 1000,
    currency: 'CNY',
    stream: false,
    cacheHit: false,
    errorCode: null,
    errorMessage: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('UsageLogRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('插入与查询', () => {
    const repo = factory.repos.usageLog;
    const log = makeLog();
    repo.insert(log);
    expect(repo.findById(log.id)?.model).toBe('kimi-k3');
    expect(repo.findByRequestId(log.requestId)?.tenant).toBe('data');
  });

  it('query 过滤与分页', () => {
    const repo = factory.repos.usageLog;
    repo.insert(makeLog({ statusCode: 200, provider: 'moonshot' }));
    repo.insert(makeLog({ statusCode: 429, provider: 'moonshot' }));
    repo.insert(makeLog({ statusCode: 200, provider: 'deepseek' }));
    const ok = repo.query({ statusCode: 200 }, { page: 1, pageSize: 10 });
    expect(ok.total).toBe(2);
    const moonshot = repo.query({ provider: 'moonshot' }, { page: 1, pageSize: 10 });
    expect(moonshot.total).toBe(2);
    const search = repo.query({ search: 'kimi' }, { page: 1, pageSize: 10 });
    expect(search.total).toBe(3);
  });

  it('deleteOlderThan', () => {
    const repo = factory.repos.usageLog;
    repo.insert(makeLog({ createdAt: '2020-01-01T00:00:00.000Z' }));
    repo.insert(makeLog({ createdAt: new Date().toISOString() }));
    const deleted = repo.deleteOlderThan('2021-01-01T00:00:00.000Z');
    expect(deleted).toBe(1);
  });

  it('queryRange 聚合区间', () => {
    const repo = factory.repos.usageLog;
    repo.insert(makeLog({ createdAt: '2026-07-01T00:00:00.000Z', model: 'a' }));
    repo.insert(makeLog({ createdAt: '2026-07-02T00:00:00.000Z', model: 'b' }));
    const logs = repo.queryRange({ startTime: '2026-07-01T00:00:00.000Z', endTime: '2026-07-01T23:59:59.000Z' });
    expect(logs.length).toBe(1);
  });
});
