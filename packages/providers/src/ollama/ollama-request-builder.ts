import type { ProviderChatParams } from '@uag/types';

/**
 * Ollama 请求构建（/api/chat 格式）
 * messages 直接透传，model 为本地模型名。
 */
export class OllamaRequestBuilder {
  buildBody(params: ProviderChatParams): Record<string, unknown> {
    return {
      model: params.model,
      messages: params.messages,
      ...(params.stream !== undefined ? { stream: params.stream } : {}),
      ...(params.temperature !== undefined ? { options: { temperature: params.temperature } } : {}),
    };
  }
}
