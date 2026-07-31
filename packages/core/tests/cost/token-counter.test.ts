import { TokenCounter } from '../../src/cost';

describe('TokenCounter', () => {
  it('估算 prompt tokens', () => {
    const counter = new TokenCounter();
    const tokens = counter.estimatePrompt([
      { role: 'user', content: '你好世界' },
      { role: 'assistant', content: 'hello' },
    ]);
    expect(tokens).toBeGreaterThan(0);
  });

  it('估算 completion tokens', () => {
    const counter = new TokenCounter();
    expect(counter.estimateCompletion('abc')).toBe(1);
    expect(counter.estimateCompletion('abcdefgh')).toBe(2);
  });

  it('estimateUsage 汇总', () => {
    const counter = new TokenCounter();
    const usage = counter.estimateUsage([{ role: 'user', content: 'hi' }], 'hello');
    expect(usage.totalTokens).toBe(usage.promptTokens + usage.completionTokens);
  });
});
