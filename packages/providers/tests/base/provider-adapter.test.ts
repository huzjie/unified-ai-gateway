import { ProviderAdapterBase } from '../../src/base/provider-adapter';
import type { CallOptions, HealthStatus, ProviderChatParams, ProviderChatResult, ProviderModel, ProviderStreamEvent } from '@uag/types';

class TestAdapter extends ProviderAdapterBase {
  readonly type = 'mock' as const;
  readonly name = 'test';

  async chat(params: ProviderChatParams): Promise<ProviderChatResult> {
    return {
      id: '1', model: params.model, provider: 'test', content: 'hi',
      usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
      createdAt: new Date().toISOString(),
    };
  }
  async *chatStream(): AsyncIterable<ProviderStreamEvent> {
    yield { type: 'done' };
  }
  async listModels(): Promise<ProviderModel[]> {
    return [];
  }
  async healthCheck(): Promise<HealthStatus> {
    return 'healthy';
  }
}

describe('ProviderAdapterBase', () => {
  it('toOpenAICompatible 转换', async () => {
    const adapter = new TestAdapter();
    const result = await adapter.chat({ model: 'm', messages: [] }, { timeoutMs: 1000, maxRetries: 0 });
    const resp = adapter.toOpenAICompatible!(result);
    expect(resp.object).toBe('chat.completion');
    expect(resp.choices[0].message.content).toBe('hi');
    expect(resp.usage?.total_tokens).toBe(2);
    expect(resp.provider).toBe('test');
  });

  it('getProviderName', () => {
    const adapter = new TestAdapter();
    expect(adapter.getProviderName()).toBe('test');
  });
});
