import { ProviderFactory } from '../src/factory/provider-factory';
import { ProviderConfigMapper } from '../src/factory/provider-config-mapper';
import { MockProvider } from '../src/mock/mock-provider';

describe('ProviderFactory', () => {
  const factory = new ProviderFactory();

  it('创建各类型适配器', () => {
    const configs = [
      { type: 'openai' as const, name: 'o', baseUrl: 'http://o', apiKey: null },
      { type: 'moonshot' as const, name: 'm', baseUrl: 'http://m', apiKey: null },
      { type: 'deepseek' as const, name: 'd', baseUrl: 'http://d', apiKey: null },
      { type: 'minimax' as const, name: 'mi', baseUrl: 'http://mi', apiKey: null },
      { type: 'anthropic' as const, name: 'a', baseUrl: 'http://a', apiKey: null },
      { type: 'ollama' as const, name: 'ol', baseUrl: 'http://ol' },
      { type: 'mock' as const, name: 'mk' },
    ];
    for (const config of configs) {
      const adapter = factory.create(config);
      expect(adapter.name).toBe(config.name);
    }
  });

  it('支持类型列表完整', () => {
    expect(ProviderFactory.supportedTypes()).toEqual([
      'openai', 'moonshot', 'deepseek', 'minimax', 'anthropic', 'ollama', 'mock',
    ]);
  });

  it('未知类型抛错', () => {
    expect(() => factory.create({ type: 'unknown' as never, name: 'x' })).toThrow();
  });
});

describe('ProviderConfigMapper', () => {
  it('从实体映射', () => {
    const mapper = new ProviderConfigMapper();
    const config = mapper.map(
      {
        id: 'p1', name: 'mock-1', type: 'mock', baseUrl: 'http://m', encryptedApiKey: null,
        models: ['a'], pricing: {}, timeoutMs: 1000, maxRetries: 1,
        enabled: 'enabled', healthStatus: 'unknown',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      },
      'plain-key',
    );
    expect(config.type).toBe('mock');
    expect((config as { apiKey: string | null }).apiKey).toBe('plain-key');
  });

  it('从输入映射', () => {
    const mapper = new ProviderConfigMapper();
    const config = mapper.mapFromInput({
      name: 'deepseek',
      type: 'deepseek',
      baseUrl: 'https://api.deepseek.com/v1',
      apiKey: 'sk-1',
      models: ['deepseek-chat'],
    });
    expect(config.type).toBe('deepseek');
  });
});
