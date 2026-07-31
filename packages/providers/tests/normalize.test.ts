import { normalizeModelName, normalizeParams } from '../src/utils/normalize';

describe('normalize utils', () => {
  it('模型名归一', () => {
    expect(normalizeModelName(' GPT-4o ')).toBe('gpt-4o');
    expect(normalizeModelName('kimi_k3!')).toBe('kimi-k3');
  });

  it('参数归一', () => {
    const params = normalizeParams({ model: 'm', messages: [] });
    expect(params.temperature).toBe(1);
    expect(params.maxTokens).toBe(4096);
  });
});
