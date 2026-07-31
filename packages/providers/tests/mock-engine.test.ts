import { MockEngine } from '../src/mock/mock-engine';

describe('MockEngine', () => {
  it('echo 回显', () => {
    const engine = new MockEngine();
    const result = engine.generateResponse({
      model: 'mock',
      messages: [{ role: 'user', content: 'hello world' }],
    });
    expect(result.content).toContain('hello world');
  });

  it('fixedResponse 覆盖', () => {
    const engine = new MockEngine({ fixedResponse: 'FIX' });
    expect(engine.generateResponse({ model: 'm', messages: [] }).content).toBe('FIX');
  });

  it('failureRate 边界', () => {
    expect(new MockEngine({ failureRate: 0 }).shouldFail()).toBe(false);
    expect(new MockEngine({ failureRate: 1 }).shouldFail()).toBe(true);
  });

  it('usage 统计', () => {
    const engine = new MockEngine();
    const result = engine.generateResponse({ model: 'm', messages: [{ role: 'user', content: 'abcd' }] });
    expect(result.usage!.totalTokens).toBe(result.usage!.promptTokens + result.usage!.completionTokens);
  });
});
