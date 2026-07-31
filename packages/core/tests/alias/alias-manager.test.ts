import { ModelAliasManager, AliasResolver } from '../../src/alias';

describe('ModelAliasManager', () => {
  it('设置与获取别名', () => {
    const manager = new ModelAliasManager();
    manager.set('my-main', ['moonshot', 'deepseek']);
    const alias = manager.get('my-main');
    expect(alias).not.toBeNull();
    expect(alias!.targets).toEqual(['moonshot', 'deepseek']);
    expect(alias!.primary).toBe('moonshot');
    expect(alias!.fallbacks).toEqual(['deepseek']);
  });

  it('删除与判断存在', () => {
    const manager = new ModelAliasManager({ a: ['x'] });
    expect(manager.has('a')).toBe(true);
    expect(manager.delete('a')).toBe(true);
    expect(manager.has('a')).toBe(false);
  });

  it('校验：空名/空目标/重复目标', () => {
    const manager = new ModelAliasManager();
    expect(() => manager.set('', ['a'])).toThrow();
    expect(() => manager.set('a b', ['a'])).toThrow();
    expect(() => manager.set('a', [])).toThrow();
    expect(() => manager.set('a', ['x', 'x'])).toThrow();
  });

  it('list 返回全部', () => {
    const manager = new ModelAliasManager({ a: ['1'], b: ['2'] });
    expect(manager.list().length).toBe(2);
  });
});

describe('AliasResolver', () => {
  it('别名解析返回候选', () => {
    const manager = new ModelAliasManager({ 'my-main': ['moonshot', 'deepseek'] });
    const resolver = new AliasResolver(manager);
    const result = resolver.resolve('my-main');
    expect(result.isAlias).toBe(true);
    expect(result.resolved).toBe('moonshot');
    expect(result.candidates).toEqual(['moonshot', 'deepseek']);
  });

  it('非别名直通', () => {
    const manager = new ModelAliasManager();
    const resolver = new AliasResolver(manager);
    const result = resolver.resolve('gpt-4o');
    expect(result.isAlias).toBe(false);
    expect(result.resolved).toBe('gpt-4o');
    expect(result.candidates).toEqual([]);
  });
});
