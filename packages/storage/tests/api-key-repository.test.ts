import { StorageFactory } from '../src/factory/storage-factory';

describe('ApiKeyRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('创建 Key 并查询', () => {
    const repo = factory.repos.apiKey;
    const key = repo.create({
      name: 'test',
      tenant: 'dev',
      keyHash: 'abc123',
      salt: 'salt',
      keyPrefix: 'sk-test',
      modelWhitelist: ['deepseek*'],
      qpsLimit: 10,
      concurrencyLimit: 5,
    });
    expect(key.id).toBeTruthy();
    expect(key.keyHash).toBe('abc123');
    expect(key.modelWhitelist).toEqual(['deepseek*']);
    expect(repo.findById(key.id)?.tenant).toBe('dev');
    expect(repo.findByHash('abc123')?.name).toBe('test');
  });

  it('revoke 吊销', () => {
    const repo = factory.repos.apiKey;
    const key = repo.create({ name: 'a', tenant: 't', keyHash: 'h1', salt: 's', keyPrefix: 'sk' });
    repo.revoke(key.id, new Date().toISOString());
    expect(repo.findById(key.id)?.status).toBe('revoked');
  });

  it('update 更新字段', () => {
    const repo = factory.repos.apiKey;
    const key = repo.create({ name: 'a', tenant: 't', keyHash: 'h2', salt: 's', keyPrefix: 'sk' });
    const updated = repo.update(key.id, { qpsLimit: 99, modelWhitelist: ['gpt-4o'] });
    expect(updated.qpsLimit).toBe(99);
    expect(updated.modelWhitelist).toEqual(['gpt-4o']);
  });

  it('list 分页与过滤', () => {
    const repo = factory.repos.apiKey;
    for (let i = 0; i < 5; i++) {
      repo.create({ name: `k${i}`, tenant: i % 2 === 0 ? 'a' : 'b', keyHash: `h-${i}`, salt: 's', keyPrefix: 'sk' });
    }
    const page = repo.list({ tenant: 'a' }, { page: 1, pageSize: 20 });
    expect(page.total).toBe(3);
    expect(page.items.length).toBe(3);
  });

  it('touchLastUsed', () => {
    const repo = factory.repos.apiKey;
    const key = repo.create({ name: 'a', tenant: 't', keyHash: 'h3', salt: 's', keyPrefix: 'sk' });
    const now = new Date().toISOString();
    repo.touchLastUsed(key.id, now);
    expect(repo.findById(key.id)?.lastUsedAt).toBe(now);
  });
});
