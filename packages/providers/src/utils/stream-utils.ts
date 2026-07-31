import type { ProviderStreamEvent, SSEChunk } from '@uag/types';

/**
 * 流合并/转换工具
 */
export async function* mergeStreams(
  streams: Array<AsyncIterable<ProviderStreamEvent>>,
): AsyncIterable<ProviderStreamEvent> {
  for (const stream of streams) {
    yield* stream;
  }
}

/** 构造 OpenAI 兼容 SSE 块 */
export function toOpenAISseChunk(input: {
  id: string;
  model: string;
  delta?: { role?: string; content?: string | null };
  finishReason?: string | null;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}): SSEChunk {
  return {
    id: input.id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: input.model,
    choices: [{ index: 0, delta: input.delta ?? {}, finish_reason: input.finishReason ?? null }],
    ...(input.usage ? { usage: input.usage } : {}),
  };
}
