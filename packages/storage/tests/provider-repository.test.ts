import { StorageFactory } from '../src/factory/storage-factory';

describe('ProviderRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('创建与查询 Provider', () => {
    const repo = factory.repos.provider;
    const provider = repo.create({
      name: 'moonshot-prod',
      type: 'moonshot',
      baseUrl: 'https://api.moonshot.cn/v1',
      encryptedApiKey: 'enc:xxx',
      models: ['kimi-k3'],
      pricing: { 'kimi-k3': { input: 10, output: 20 } },
    });
    expect(provider.name).toBe('moonshot-prod');
    expect(provider.type).toBe('moonshot');
    expect(repo.findById(provider.id)?.models).toEqual(['kimi-k3']);
    expect(repo.findByName('moonshot-prod')?.baseUrl).toContain('moonshot');
  });

  it('name 唯一约束', () => {
    const repo = factory.repos.provider;
    repo.create({ name: 'a', type: 'mock', baseUrl: 'http://mock' });
    expect(() => repo.create({ name: 'a', type: 'mock', baseUrl: 'http://mock2' })).toThrow();
  });

  it('update 与 health', () => {
    const repo = factory.repos.provider;
    const p = repo.create({ name: 'b', type: 'mock', baseUrl: 'http://mock' });
    const updated = repo.update(p.id, { baseUrl: 'http://new', timeoutMs: 5000 });
    expect(updated.baseUrl).toBe('http://new');
    expect(updated.timeoutMs).toBe(5000);
    repo.updateHealth(p.id, 'healthy');
    expect(repo.findById(p.id)?.healthStatus).toBe('healthy');
  });

  it('list 过滤与分页', () => {
    const repo = factory.repos.provider;
    repo.create({ name: 'openai', type: 'openai', baseUrl: 'http://o' });
    repo.create({ name: 'moonshot', type: 'moonshot', baseUrl: 'http://m' });
    repo.create({ name: 'mock', type: 'mock', baseUrl: 'http://x', enabled: 'disabled' });
    const page = repo.list({ type: 'moonshot' }, { page: 1, pageSize: 10 });
    expect(page.total).toBe(1);
    expect(repo.listAll().length).toBe(3);
  });

  it('delete 删除', () => {
    const repo = factory.repos.provider;
    const p = repo.create({ name: 'c', type: 'mock', baseUrl: 'http://mock' });
    repo.delete(p.id);
    expect(repo.findById(p.id)).toBeNull();
  });
});
