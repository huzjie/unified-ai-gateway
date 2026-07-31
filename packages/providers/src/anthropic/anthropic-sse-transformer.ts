import type { ProviderStreamEvent, RawSSEEvent } from '@uag/types';
import type { SSEChunk } from '@uag/types';

/**
 * Anthropic SSE 转换（event 类型 → OpenAI 兼容）
 */
export class AnthropicSseTransformer {
  /** 转换单个 Anthropic SSE 事件 */
  transformEvent(event: RawSSEEvent, model: string): ProviderStreamEvent | null {
    if (event.event === 'message_start') {
      const data = this.safeParse(event.data) as { message?: { id?: string } };
      const chunk: SSEChunk = {
        id: data?.message?.id ?? `msg-${Date.now()}`,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }],
      };
      return { type: 'chunk', chunk };
    }
    if (event.event === 'content_block_delta') {
      const data = this.safeParse(event.data) as {
        delta?: { type?: string; text?: string };
      };
      const text = data?.delta?.text ?? '';
      if (!text) {
        return null;
      }
      const chunk: SSEChunk = {
        id: `msg-${Date.now()}`,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{ index: 0, delta: { content: text }, finish_reason: null }],
      };
      return { type: 'chunk', chunk };
    }
    if (event.event === 'message_delta') {
      const data = this.safeParse(event.data) as {
        usage?: { output_tokens?: number };
      };
      return {
        type: 'done',
        usage: data?.usage?.output_tokens
          ? { promptTokens: 0, completionTokens: data.usage.output_tokens, totalTokens: data.usage.output_tokens }
          : undefined,
      };
    }
    if (event.event === 'message_stop') {
      return { type: 'done' };
    }
    if (event.event === 'error') {
      const data = this.safeParse(event.data) as { error?: { message?: string } };
      return {
        type: 'error',
        error: new Error(data?.error?.message ?? 'Anthropic 流错误'),
        retryable: true,
      };
    }
    return null;
  }

  private safeParse(data: string): unknown {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}
