import type { ProviderChatResult } from '@uag/types';

/**
 * 上游响应 → 归一化响应
 * 默认解析 OpenAI 兼容响应。
 */
export class ResponseParser {
  /** 解析 OpenAI 兼容响应体 */
  parseOpenAICompatible(body: unknown, provider: string, fallbackModel: string): ProviderChatResult {
    const data = body as {
      id?: string;
      model?: string;
      choices?: Array<{
        message?: { content?: string | null; role?: string };
        finish_reason?: string | null;
      }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
      error?: { message?: string; type?: string };
    };

    if (data.error) {
      throw new Error(data.error.message ?? '上游返回错误');
    }

    const content = data.choices?.[0]?.message?.content ?? '';
    const usage = data.usage;
    return {
      id: data.id ?? `chatcmpl-${Date.now()}`,
      model: data.model ?? fallbackModel,
      provider,
      content,
      usage: usage
        ? {
            promptTokens: usage.prompt_tokens ?? 0,
            completionTokens: usage.completion_tokens ?? 0,
            totalTokens: usage.total_tokens ?? 0,
          }
        : undefined,
      finishReason: data.choices?.[0]?.finish_reason ?? 'stop',
      raw: data,
      createdAt: new Date().toISOString(),
    };
  }

  /** 解析非标准响应（子类覆盖） */
  parse(body: unknown, provider: string, fallbackModel: string): ProviderChatResult {
    return this.parseOpenAICompatible(body, provider, fallbackModel);
  }
}
