import { MoonshotProvider } from '../src/moonshot/moonshot-provider';

describe('MoonshotProvider', () => {
  const provider = new MoonshotProvider({
    name: 'moonshot-prod',
    baseUrl: 'https://api.moonshot.cn/v1',
    apiKey: 'sk-moonshot',
  });

  it('类型与模型清单', async () => {
    expect(provider.type).toBe('moonshot');
    const models = await provider.listModels();
    expect(models.some((m) => m.id === 'kimi-k3')).toBe(true);
  });

  it('listModels 支持自定义模型', async () => {
    const p = new MoonshotProvider({ name: 'm', baseUrl: 'http://x', apiKey: null, models: ['custom-model'] });
    const models = await p.listModels();
    expect(models[0].id).toBe('custom-model');
  });
});
