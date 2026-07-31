import { StorageFactory } from '../src/factory/storage-factory';

describe('RouteRuleRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('创建与查询规则', () => {
    const repo = factory.repos.routeRule;
    const rule = repo.create({
      name: 'main',
      matchModel: 'my-main',
      strategy: 'priority',
      targets: ['moonshot', 'deepseek'],
      fallbackTargets: ['ollama'],
    });
    expect(rule.strategy).toBe('priority');
    expect(rule.targets).toEqual(['moonshot', 'deepseek']);
    expect(repo.findById(rule.id)?.fallbackTargets).toEqual(['ollama']);
    expect(repo.findByName('main')?.matchModel).toBe('my-main');
  });

  it('listEnabled 只返回启用', () => {
    const repo = factory.repos.routeRule;
    repo.create({ name: 'a', targets: ['x'], enabled: true });
    repo.create({ name: 'b', targets: ['y'], enabled: false });
    expect(repo.listEnabled().length).toBe(1);
  });

  it('update 与 delete', () => {
    const repo = factory.repos.routeRule;
    const rule = repo.create({ name: 'c', targets: ['x'] });
    const updated = repo.update(rule.id, { strategy: 'cost-first', targets: ['deepseek'] });
    expect(updated.strategy).toBe('cost-first');
    expect(updated.targets).toEqual(['deepseek']);
    repo.delete(rule.id);
    expect(repo.findById(rule.id)).toBeNull();
  });

  it('name 唯一', () => {
    const repo = factory.repos.routeRule;
    repo.create({ name: 'dup', targets: ['x'] });
    expect(() => repo.create({ name: 'dup', targets: ['y'] })).toThrow();
  });
});
