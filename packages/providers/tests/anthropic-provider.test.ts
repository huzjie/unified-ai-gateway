import { AnthropicProvider } from '../src/anthropic/anthropic-provider';
import { AnthropicRequestBuilder } from '../src/anthropic/anthropic-request-builder';
import { AnthropicResponseParser } from '../src/anthropic/anthropic-response-parser';
import { AnthropicSseTransformer } from '../src/anthropic/anthropic-sse-transformer';

describe('AnthropicProvider', () => {
  const provider = new AnthropicProvider({
    name: 'anthropic-prod',
    baseUrl: 'https://api.anthropic.com',
    apiKey: 'sk-ant',
  });

  it('类型与模型清单', async () => {
    expect(provider.type).toBe('anthropic');
    const models = await provider.listModels();
    expect(models.some((m) => m.id === 'claude-3-5-sonnet')).toBe(true);
  });
});

describe('AnthropicRequestBuilder（协议转换）', () => {
  const builder = new AnthropicRequestBuilder();

  it('转换 messages 并拆分 system', () => {
    const body = builder.buildBody({
      model: 'claude-3-5-sonnet',
      messages: [
        { role: 'system', content: '你是助手' },
        { role: 'user', content: '你好' },
        { role: 'assistant', content: 'hi' },
      ],
      maxTokens: 1024,
      temperature: 0.5,
    });
    expect(body.model).toBe('claude-3-5-sonnet');
    expect(body.system).toBe('你是助手');
    expect(body.messages).toEqual([
      { role: 'user', content: '你好' },
      { role: 'assistant', content: 'hi' },
    ]);
    expect(body.max_tokens).toBe(1024);
  });

  it('无 system 消息时不设置 system 字段', () => {
    const body = builder.buildBody({
      model: 'claude',
      messages: [{ role: 'user', content: 'hi' }],
    });
    expect(body.system).toBeUndefined();
    expect(body.messages).toHaveLength(1);
  });
});

describe('AnthropicResponseParser', () => {
  const parser = new AnthropicResponseParser();

  it('解析 messages API 响应', () => {
    const result = parser.parse(
      {
        id: 'msg_1',
        model: 'claude-3-5-sonnet',
        content: [{ type: 'text', text: '你好！' }],
        usage: { input_tokens: 10, output_tokens: 5 },
      },
      'anthropic-prod',
      'claude',
    );
    expect(result.content).toBe('你好！');
    expect(result.usage?.promptTokens).toBe(10);
    expect(result.usage?.totalTokens).toBe(15);
  });

  it('错误响应抛错', () => {
    expect(() => parser.parse({ error: { message: 'invalid' } }, 'p', 'm')).toThrow('invalid');
  });
});

describe('AnthropicSseTransformer', () => {
  const transformer = new AnthropicSseTransformer();

  it('message_delta 产生 done', () => {
    const evt = transformer.transformEvent({ event: 'message_delta', data: '{"usage":{"output_tokens":42}}' }, 'm');
    expect(evt?.type).toBe('done');
  });

  it('content_block_delta 产生 chunk', () => {
    const evt = transformer.transformEvent(
      { event: 'content_block_delta', data: '{"delta":{"type":"text_delta","text":"你好"}}' },
      'claude',
    );
    expect(evt?.type).toBe('chunk');
    if (evt?.type === 'chunk') {
      expect(evt.chunk.choices[0].delta.content).toBe('你好');
    }
  });

  it('message_stop 产生 done', () => {
    const evt = transformer.transformEvent({ event: 'message_stop', data: '' }, 'm');
    expect(evt?.type).toBe('done');
  });
});
