import { ProviderRegistry } from '../src/registry/provider-registry';
import { RegisteredProvider } from '../src/registry/registered-provider';
import { MockProvider } from '../src/mock/mock-provider';

describe('ProviderRegistry', () => {
  it('注册与获取', () => {
    const registry = new ProviderRegistry();
    const adapter = new MockProvider({ name: 'mock-1' });
    registry.register(adapter);
    expect(registry.has('mock-1')).toBe(true);
    expect(registry.get('mock-1')).toBe(adapter);
    expect(registry.get('none')).toBeNull();
  });

  it('批量注册与列表', () => {
    const registry = new ProviderRegistry();
    registry.registerAll([new MockProvider({ name: 'a' }), new MockProvider({ name: 'b' })]);
    expect(registry.size).toBe(2);
    expect(registry.list().length).toBe(2);
    expect(registry.listByType('mock').length).toBe(2);
  });

  it('移除与清空', () => {
    const registry = new ProviderRegistry();
    registry.register(new MockProvider({ name: 'x' }));
    expect(registry.remove('x')).toBe(true);
    expect(registry.remove('x')).toBe(false);
    registry.register(new MockProvider({ name: 'y' }));
    registry.clear();
    expect(registry.size).toBe(0);
  });
});

describe('RegisteredProvider', () => {
  it('健康状态包装', () => {
    const adapter = new MockProvider({ name: 'm' });
    const registered = new RegisteredProvider(adapter);
    expect(registered.isRoutable()).toBe(true);
    registered.setHealth('unhealthy');
    expect(registered.isRoutable()).toBe(false);
    registered.setHealth('healthy');
    expect(registered.health).toBe('healthy');
  });
});
