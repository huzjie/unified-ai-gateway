import type { ProviderChatResult } from '@uag/types';

/**
 * Anthropic 响应解析（messages API → 归一化）
 */
export class AnthropicResponseParser {
  parse(body: unknown, provider: string, fallbackModel: string): ProviderChatResult {
    const data = body as {
      id?: string;
      model?: string;
      content?: Array<{ type: string; text?: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
      error?: { message?: string };
    };

    if (data.error) {
      throw new Error(data.error.message ?? 'Anthropic 返回错误');
    }

    const content = (data.content ?? [])
      .filter((c) => c.type === 'text' && c.text)
      .map((c) => c.text)
      .join('');

    const usage = data.usage;
    return {
      id: data.id ?? `msg-${Date.now()}`,
      model: data.model ?? fallbackModel,
      provider,
      content,
      usage: usage
        ? {
            promptTokens: usage.input_tokens ?? 0,
            completionTokens: usage.output_tokens ?? 0,
            totalTokens: (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0),
          }
        : undefined,
      finishReason: 'stop',
      raw: data,
      createdAt: new Date().toISOString(),
    };
  }
}
