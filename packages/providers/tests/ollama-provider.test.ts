import { OllamaProvider } from '../src/ollama/ollama-provider';
import { OllamaRequestBuilder } from '../src/ollama/ollama-request-builder';
import { OllamaResponseParser } from '../src/ollama/ollama-response-parser';
import { OllamaSseTransformer } from '../src/ollama/ollama-sse-transformer';

describe('OllamaProvider', () => {
  const provider = new OllamaProvider({
    name: 'ollama-local',
    baseUrl: 'http://localhost:11434',
  });

  it('类型与模型清单', async () => {
    expect(provider.type).toBe('ollama');
    const models = await provider.listModels();
    expect(models.some((m) => m.id === 'llama3.1')).toBe(true);
  });

  it('healthCheck 失败返回 unhealthy（无服务）', async () => {
    const status = await provider.healthCheck();
    expect(['healthy', 'unhealthy']).toContain(status);
  });
});

describe('OllamaRequestBuilder', () => {
  it('构建 /api/chat 请求体', () => {
    const builder = new OllamaRequestBuilder();
    const body = builder.buildBody({
      model: 'llama3.1',
      messages: [{ role: 'user', content: 'hi' }],
      stream: true,
      temperature: 0.7,
    });
    expect(body.model).toBe('llama3.1');
    expect(body.stream).toBe(true);
    expect((body.options as Record<string, unknown>).temperature).toBe(0.7);
  });
});

describe('OllamaResponseParser', () => {
  it('解析响应', () => {
    const parser = new OllamaResponseParser();
    const result = parser.parse(
      { model: 'llama3.1', message: { content: 'hello', role: 'assistant' }, done: true },
      'ollama-local',
      'llama3.1',
    );
    expect(result.content).toBe('hello');
    expect(result.finishReason).toBe('stop');
  });

  it('错误响应抛错', () => {
    const parser = new OllamaResponseParser();
    expect(() => parser.parse({ error: 'model not found' }, 'p', 'm')).toThrow('model not found');
  });
});

describe('OllamaSseTransformer', () => {
  it('NDJSON 行转换', () => {
    const transformer = new OllamaSseTransformer();
    const evt = transformer.transformNdjson({ message: { content: '你好' }, done: false }, 'llama3.1');
    expect(evt?.type).toBe('chunk');
    if (evt?.type === 'chunk') {
      expect(evt.chunk.choices[0].delta.content).toBe('你好');
    }
    const done = transformer.transformNdjson({ done: true }, 'llama3.1');
    expect(done?.type).toBe('done');
  });
});
