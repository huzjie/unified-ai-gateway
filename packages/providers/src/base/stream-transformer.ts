import type { SSEChunk } from '@uag/types';

/**
 * 上游 SSE → OpenAI 兼容 SSE
 */
export class StreamTransformer {
  /** 解析上游 chunk 为 OpenAI 兼容 SSE 块 */
  transform(raw: unknown, fallback: { id: string; model: string }): SSEChunk {
    const data = raw as {
      id?: string;
      model?: string;
      choices?: Array<{
        index?: number;
        delta?: { role?: string; content?: string | null };
        message?: { role?: string; content?: string | null };
        finish_reason?: string | null;
      }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
    };
    const choice = data.choices?.[0];
    return {
      id: data.id ?? fallback.id,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model: data.model ?? fallback.model,
      choices: [
        {
          index: choice?.index ?? 0,
          delta: choice?.delta ?? (choice?.message ? { role: choice.message.role, content: choice.message.content } : {}),
          finish_reason: choice?.finish_reason ?? null,
        },
      ],
      usage: data.usage
        ? {
            prompt_tokens: data.usage.prompt_tokens ?? 0,
            completion_tokens: data.usage.completion_tokens ?? 0,
            total_tokens: data.usage.total_tokens ?? 0,
          }
        : undefined,
    };
  }

  /** 序列化为 SSE 文本帧 */
  serialize(chunk: SSEChunk): string {
    return `data: ${JSON.stringify(chunk)}\n\n`;
  }

  /** 结束帧 */
  doneFrame(): string {
    return 'data: [DONE]\n\n';
  }
}
