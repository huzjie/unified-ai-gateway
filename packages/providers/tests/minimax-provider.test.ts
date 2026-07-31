import { MiniMaxProvider } from '../src/minimax/minimax-provider';

describe('MiniMaxProvider', () => {
  const provider = new MiniMaxProvider({
    name: 'minimax-prod',
    baseUrl: 'https://api.minimax.chat/v1',
    apiKey: 'sk-minimax',
    groupId: 'grp-1',
  });

  it('类型与模型清单', async () => {
    expect(provider.type).toBe('minimax');
    const models = await provider.listModels();
    expect(models.length).toBeGreaterThan(0);
  });
});
