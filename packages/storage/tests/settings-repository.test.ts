import { StorageFactory } from '../src/factory/storage-factory';

describe('SettingsRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('默认设置', () => {
    const settings = factory.repos.settings.get();
    expect(settings.defaultTimeoutMs).toBe(30000);
    expect(settings.globalQps).toBe(1000);
  });

  it('更新设置并持久化', () => {
    const repo = factory.repos.settings;
    const updated = repo.update({ globalQps: 500, breakerFailureThreshold: 0.3 });
    expect(updated.globalQps).toBe(500);
    expect(updated.breakerFailureThreshold).toBe(0.3);
    const reloaded = repo.get();
    expect(reloaded.globalQps).toBe(500);
  });

  it('部分更新保留其他字段', () => {
    const repo = factory.repos.settings;
    repo.update({ defaultTimeoutMs: 10000 });
    const s = repo.get();
    expect(s.defaultTimeoutMs).toBe(10000);
    expect(s.globalQps).toBe(1000);
  });

  it('raw KV', () => {
    const repo = factory.repos.settings;
    repo.setRaw('custom', { hello: 'world' });
    expect(repo.getRaw('custom')).toContain('world');
  });
});
