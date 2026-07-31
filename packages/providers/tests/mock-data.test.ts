import { mockChatResponse, mockModels } from '../src/mock/mock-data';
import { createMockSseStream } from '../src/mock/mock-sse';
import { asyncIterableToArray } from '@uag/core';

describe('mock data & sse', () => {
  it('mockChatResponse 结构', () => {
    const resp = mockChatResponse('mock', 'hello');
    expect(resp.object).toBe('chat.completion');
    expect(resp.choices[0].message.content).toBe('hello');
  });

  it('mockModels 有默认模型', () => {
    expect(mockModels['mock-all']).toBeDefined();
  });

  it('mock SSE 流产出 chunk + done', async () => {
    const result = {
      id: 'm1',
      model: 'mock',
      provider: 'mock',
      content: 'hello world',
      usage: { promptTokens: 1, completionTokens: 2, totalTokens: 3 },
      createdAt: new Date().toISOString(),
    };
    const events = await asyncIterableToArray(createMockSseStream(result, 'mock'));
    expect(events.filter((e) => e.type === 'chunk').length).toBeGreaterThan(1);
    expect(events.some((e) => e.type === 'done')).toBe(true);
  });
});
