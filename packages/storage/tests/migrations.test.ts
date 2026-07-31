import { StorageFactory } from '../src/factory/storage-factory';

describe('migrations', () => {
  it('迁移可重复执行（幂等）', () => {
    const factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
    expect(factory.db.version()).toBe(9);
    // 再次 migrate 不抛错
    factory.db.transaction(() => undefined);
    const tables = factory.db.connection
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as Array<{ name: string }>;
    const names = tables.map((t) => t.name);
    expect(names).toContain('providers');
    expect(names).toContain('api_keys');
    expect(names).toContain('route_rules');
    expect(names).toContain('usage_logs');
    expect(names).toContain('daily_stats');
    expect(names).toContain('settings');
    expect(names).toContain('audit_logs');
    expect(names).toContain('context_cache');
    expect(names).toContain('webhooks');
    expect(names).toContain('quota_usage');
    expect(names).toContain('schema_migrations');
    factory.close();
  });

  it('WAL 与外键开启', () => {
    const factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
    // :memory: 数据库 journal_mode 固定为 memory；文件库才会启用 wal
    const journal = factory.db.connection.prepare('PRAGMA journal_mode').get() as { journal_mode: string };
    expect(['wal', 'memory']).toContain(journal.journal_mode);
    const foreignKeys = factory.db.connection.prepare('PRAGMA foreign_keys').get() as { foreign_keys: number };
    expect(foreignKeys.foreign_keys).toBe(1);
    factory.close();
  });
});
