import { DeepSeekProvider } from '../src/deepseek/deepseek-provider';

describe('DeepSeekProvider', () => {
  const provider = new DeepSeekProvider({
    name: 'deepseek-prod',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: 'sk-deepseek',
  });

  it('类型与模型清单', async () => {
    expect(provider.type).toBe('deepseek');
    const models = await provider.listModels();
    expect(models.some((m) => m.id === 'deepseek-chat')).toBe(true);
  });

  it('健康检查无 Key 为 unknown', async () => {
    const p = new DeepSeekProvider({ name: 'd', baseUrl: 'http://x', apiKey: null });
    expect(await p.healthCheck()).toBe('unknown');
  });
});
