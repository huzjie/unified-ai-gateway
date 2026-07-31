import { MockProvider } from '../src/mock/mock-provider';
import { MockEngine } from '../src/mock/mock-engine';
import { asyncIterableToArray } from '@uag/core';

describe('MockProvider', () => {
  it('非流式全链路', async () => {
    const provider = new MockProvider({ name: 'mock-test' });
    const result = await provider.chat(
      { model: 'mock-all', messages: [{ role: 'user', content: 'hello' }] },
      { timeoutMs: 1000, maxRetries: 0 },
    );
    expect(result.content).toContain('[mock:mock-all]');
    expect(result.usage?.promptTokens).toBeGreaterThan(0);
    expect(result.provider).toBe('mock-test');
  });

  it('流式全链路', async () => {
    const provider = new MockProvider({ name: 'mock-stream' });
    const events = await asyncIterableToArray(
      provider.chatStream({ model: 'mock-all', messages: [{ role: 'user', content: 'hello world' }] }, { timeoutMs: 1000, maxRetries: 0 }),
    );
    const chunks = events.filter((e) => e.type === 'chunk');
    expect(chunks.length).toBeGreaterThan(1);
    expect(events.some((e) => e.type === 'done')).toBe(true);
  });

  it('故障注入', async () => {
    const provider = new MockProvider({
      name: 'mock-fail',
      options: { failureRate: 1, failureCode: 'UAG-4001' as never },
    });
    await expect(
      provider.chat({ model: 'mock-all', messages: [{ role: 'user', content: 'x' }] }, { timeoutMs: 1000, maxRetries: 0 }),
    ).rejects.toThrow('故障注入');
  });

  it('healthCheck 返回 healthy', async () => {
    const provider = new MockProvider({ name: 'mock-h' });
    expect(await provider.healthCheck()).toBe('healthy');
  });

  it('listModels', async () => {
    const provider = new MockProvider({ name: 'mock-m', models: ['a', 'b'] });
    const models = await provider.listModels();
    expect(models.map((m) => m.id)).toEqual(['a', 'b']);
  });
});

describe('MockEngine', () => {
  it('shouldFail 依据 failureRate', () => {
    expect(new MockEngine({ failureRate: 0 }).shouldFail()).toBe(false);
    expect(new MockEngine({ failureRate: 1 }).shouldFail()).toBe(true);
  });

  it('fixedResponse 覆盖 echo', async () => {
    const engine = new MockEngine({ fixedResponse: 'FIXED' });
    const result = engine.generateResponse({ model: 'm', messages: [{ role: 'user', content: 'hello' }] });
    expect(result.content).toBe('FIXED');
  });
});
