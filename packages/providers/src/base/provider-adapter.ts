import type {
  CallOptions,
  HealthStatus,
  OpenAICompatibleChatResponse,
  ProviderAdapter,
  ProviderChatParams,
  ProviderChatResult,
  ProviderModel,
  ProviderStreamEvent,
  ProviderType,
} from '@uag/types';

/**
 * Provider 适配器抽象基类
 * 实现公共逻辑（toOpenAICompatible、默认模型清单），子类实现协议转换。
 */
export abstract class ProviderAdapterBase implements ProviderAdapter {
  abstract readonly type: ProviderType;
  abstract readonly name: string;

  abstract chat(params: ProviderChatParams, opts: CallOptions): Promise<ProviderChatResult>;
  abstract chatStream(params: ProviderChatParams, opts: CallOptions): AsyncIterable<ProviderStreamEvent>;
  abstract listModels(): Promise<ProviderModel[]>;
  abstract healthCheck(): Promise<HealthStatus>;

  /** 将归一化响应转换为 OpenAI 兼容响应 */
  toOpenAICompatible(result: ProviderChatResult): OpenAICompatibleChatResponse {
    return {
      id: result.id,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: result.model,
      choices: [
        {
          index: 0,
          message: { role: 'assistant', content: result.content },
          finish_reason: result.finishReason ?? 'stop',
        },
      ],
      usage: result.usage
        ? {
            prompt_tokens: result.usage.promptTokens,
            completion_tokens: result.usage.completionTokens,
            total_tokens: result.usage.totalTokens,
          }
        : undefined,
      provider: result.provider,
    };
  }

  getProviderName(): string {
    return this.name;
  }
}
