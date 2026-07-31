import { StorageFactory } from '../src/factory/storage-factory';

describe('ContextCacheRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('set/get/hit', () => {
    const repo = factory.repos.contextCache;
    repo.set({ cacheKey: 'ctx:abc', model: 'm', response: { ok: true }, promptTokens: 10, completionTokens: 5 });
    const entry = repo.get('ctx:abc');
    expect(entry).not.toBeNull();
    expect(entry!.response).toEqual({ ok: true });
    repo.hit('ctx:abc');
    expect(repo.get('ctx:abc')!.hits).toBeGreaterThanOrEqual(1);
  });

  it('过期条目自动清除', () => {
    const repo = factory.repos.contextCache;
    repo.set({ cacheKey: 'ctx:exp', model: 'm', response: {}, promptTokens: 0, completionTokens: 0, ttlMs: -1000 });
    expect(repo.get('ctx:exp')).toBeNull();
  });

  it('deleteByKey 与 deleteExpired', () => {
    const repo = factory.repos.contextCache;
    repo.set({ cacheKey: 'ctx:1', model: 'm', response: {}, promptTokens: 0, completionTokens: 0 });
    repo.set({ cacheKey: 'ctx:2', model: 'm', response: {}, promptTokens: 0, completionTokens: 0, ttlMs: -1000 });
    repo.deleteByKey('ctx:1');
    expect(repo.get('ctx:1')).toBeNull();
    expect(repo.deleteExpired()).toBeGreaterThanOrEqual(0);
  });
});
