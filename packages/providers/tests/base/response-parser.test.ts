import { ResponseParser } from '../../src/base/response-parser';

describe('ResponseParser', () => {
  const parser = new ResponseParser();

  it('解析 OpenAI 兼容响应', () => {
    const result = parser.parseOpenAICompatible(
      {
        id: 'cmpl-1',
        model: 'gpt-4o',
        choices: [{ message: { content: 'hi' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 10, completion_tokens: 2, total_tokens: 12 },
      },
      'openai',
      'fallback',
    );
    expect(result.content).toBe('hi');
    expect(result.usage?.totalTokens).toBe(12);
    expect(result.provider).toBe('openai');
  });

  it('错误响应抛错', () => {
    expect(() => parser.parse({ error: { message: 'boom' } }, 'p', 'm')).toThrow('boom');
  });

  it('空内容兜底', () => {
    const result = parser.parse({ choices: [] }, 'p', 'm');
    expect(result.content).toBe('');
    expect(result.model).toBe('m');
  });
});
