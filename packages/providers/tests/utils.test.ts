import { normalizeModelName, normalizeParams } from '../src/utils/normalize';
import { generateSseEventId } from '../src/utils/event-id';
import { toOpenAISseChunk } from '../src/utils/stream-utils';

describe('provider utils', () => {
  it('normalizeModelName', () => {
    expect(normalizeModelName(' GPT-4o ')).toBe('gpt-4o');
    expect(normalizeModelName('kimi_k3!')).toBe('kimi-k3');
  });

  it('normalizeParams 填充默认', () => {
    const params = normalizeParams({ model: 'm', messages: [] });
    expect(params.temperature).toBe(1);
    expect(params.maxTokens).toBe(4096);
  });

  it('generateSseEventId 前缀', () => {
    expect(generateSseEventId()).toMatch(/^evt_/);
  });

  it('toOpenAISseChunk', () => {
    const chunk = toOpenAISseChunk({
      id: 'id1',
      model: 'm',
      delta: { content: 'hi' },
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    });
    expect(chunk.object).toBe('chat.completion.chunk');
    expect(chunk.choices[0].delta.content).toBe('hi');
    expect(chunk.usage?.total_tokens).toBe(2);
  });
});
