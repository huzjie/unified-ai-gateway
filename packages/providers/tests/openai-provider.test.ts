import { OpenAiProvider } from '../src/openai/openai-provider';
import { HttpClient } from '../src/base/http-client';

describe('OpenAiProvider', () => {
  const provider = new OpenAiProvider({
    name: 'openai-test',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: 'sk-test',
    models: ['gpt-4o'],
  });

  it('类型与名称', () => {
    expect(provider.type).toBe('openai');
    expect(provider.name).toBe('openai-test');
  });

  it('listModels 返回配置模型', async () => {
    const models = await provider.listModels();
    expect(models.length).toBe(1);
    expect(models[0].id).toBe('gpt-4o');
    expect(models[0].provider).toBe('openai-test');
  });

  it('healthCheck 无 Key 返回 unknown', async () => {
    const noKey = new OpenAiProvider({ name: 'x', baseUrl: 'http://x', apiKey: null });
    expect(await noKey.healthCheck()).toBe('unknown');
  });

  it('toOpenAICompatible 转换', async () => {
    // mock HTTP 层，避免真实调用 OpenAI API
    const spy = jest.spyOn(HttpClient.prototype, 'request').mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: 'chatcmpl-1',
        object: 'chat.completion',
        model: 'gpt-4o',
        choices: [
          { index: 0, message: { role: 'assistant', content: 'hi' }, finish_reason: 'stop' },
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      }),
      ok: true,
    });

    try {
      const result = await provider.chat(
        { model: 'gpt-4o', messages: [{ role: 'user', content: 'hi' }] },
        { timeoutMs: 5000, maxRetries: 0 },
      );
      expect(result.provider).toBe('openai-test');
      expect(result.content).toBe('hi');
      const resp = provider.toOpenAICompatible(result);
      expect(resp.object).toBe('chat.completion');
      expect(resp.choices[0].message.role).toBe('assistant');
    } finally {
      spy.mockRestore();
    }
  });
});
