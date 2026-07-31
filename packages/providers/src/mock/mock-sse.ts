import type { ProviderChatResult, ProviderStreamEvent, SSEChunk } from '@uag/types';

/**
 * 假 SSE 流（确定性：分片输出 + [DONE]）
 */
export async function* createMockSseStream(result: ProviderChatResult, model: string): AsyncIterable<ProviderStreamEvent> {
  const text = result.content;
  // 首个角色块
  const roleChunk: SSEChunk = {
    id: result.id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }],
  };
  yield { type: 'chunk', chunk: roleChunk };

  // 内容分片（每 8 字符）
  for (let i = 0; i < text.length; i += 8) {
    const piece = text.slice(i, i + 8);
    const chunk: SSEChunk = {
      id: result.id,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{ index: 0, delta: { content: piece }, finish_reason: null }],
    };
    yield { type: 'chunk', chunk };
  }

  // 结束块（含 usage）
  const finishChunk: SSEChunk = {
    id: result.id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
    usage: result.usage
      ? {
          prompt_tokens: result.usage.promptTokens,
          completion_tokens: result.usage.completionTokens,
          total_tokens: result.usage.totalTokens,
        }
      : undefined,
  };
  yield { type: 'chunk', chunk: finishChunk };
  yield { type: 'done', usage: result.usage };
}
