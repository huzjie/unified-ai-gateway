import { StorageFactory } from '../src/factory/storage-factory';

describe('QuotaRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('get 默认空', () => {
    expect(factory.repos.quota.get('tenant-1')).toBeNull();
  });

  it('addUsage 累积', () => {
    const repo = factory.repos.quota;
    repo.addUsage('tenant-1', 100, 1.5);
    repo.addUsage('tenant-1', 50, 0.5);
    const usage = repo.get('tenant-1')!;
    expect(usage.tokensUsed).toBe(150);
    expect(usage.amountUsed).toBeCloseTo(2.0);
  });

  it('reset 清零', () => {
    const repo = factory.repos.quota;
    repo.addUsage('t', 100, 1);
    repo.reset('t', repo.get('t')!.period);
    expect(repo.get('t')!.tokensUsed).toBe(0);
  });
});
