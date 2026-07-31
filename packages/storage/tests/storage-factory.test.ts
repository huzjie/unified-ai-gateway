import { StorageFactory } from '../src/factory/storage-factory';

describe('StorageFactory', () => {
  it('创建完整存储（连接+迁移+仓储）', () => {
    const factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
    expect(factory.db.version()).toBe(9);
    expect(factory.repos.apiKey).toBeDefined();
    expect(factory.repos.provider).toBeDefined();
    expect(factory.repos.routeRule).toBeDefined();
    expect(factory.repos.usageLog).toBeDefined();
    expect(factory.repos.settings).toBeDefined();
    factory.close();
  });
});
