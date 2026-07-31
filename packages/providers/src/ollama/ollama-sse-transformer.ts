import type { ProviderStreamEvent, SSEChunk } from '@uag/types';

/**
 * Ollama SSE 转换（NDJSON → OpenAI 兼容）
 */
export class OllamaSseTransformer {
  /** 转换单条 NDJSON 行 */
  transformNdjson(data: unknown, model: string): ProviderStreamEvent | null {
    const obj = data as {
      message?: { content?: string };
      done?: boolean;
      error?: string;
    } | null;
    if (!obj) {
      return null;
    }
    if (obj.error) {
      return { type: 'error', error: new Error(obj.error), retryable: false };
    }
    if (obj.done) {
      return { type: 'done' };
    }
    const content = obj.message?.content ?? '';
    if (!content) {
      return null;
    }
    const chunk: SSEChunk = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{ index: 0, delta: { content }, finish_reason: null }],
    };
    return { type: 'chunk', chunk };
  }
}
