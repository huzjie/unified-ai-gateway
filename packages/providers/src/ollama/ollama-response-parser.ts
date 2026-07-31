import type { ProviderChatResult } from '@uag/types';

/**
 * Ollama 响应解析（/api/chat → 归一化）
 */
export class OllamaResponseParser {
  parse(body: unknown, provider: string, fallbackModel: string): ProviderChatResult {
    const data = body as {
      model?: string;
      message?: { content?: string; role?: string };
      done?: boolean;
      error?: string;
    };
    if (data.error) {
      throw new Error(data.error);
    }
    const content = data.message?.content ?? '';
    return {
      id: `ollama-${Date.now()}`,
      model: data.model ?? fallbackModel,
      provider,
      content,
      finishReason: data.done ? 'stop' : undefined,
      raw: data,
      createdAt: new Date().toISOString(),
    };
  }
}
