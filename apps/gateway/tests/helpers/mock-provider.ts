import { MockProvider } from '@uag/providers';
import { ProviderRegistry } from '@uag/providers';

/** 测试注入 mock 适配器 */
export function installMockProvider(registry: ProviderRegistry, name = 'mock'): MockProvider {
  const provider = new MockProvider({ name });
  registry.register(provider);
  return provider;
}
