/** 测试用 SSE 分片 */
export const sseChunks = {
  openaiChunk: 'data: {"id":"chatcmpl-1","object":"chat.completion.chunk","created":1750000000,"model":"gpt-4o","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}\n\n',
  openaiContent: 'data: {"id":"chatcmpl-1","object":"chat.completion.chunk","created":1750000000,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}\n\n',
  done: 'data: [DONE]\n\n',
  anthropicMessageStart: 'event: message_start\ndata: {"type":"message_start","message":{"id":"msg_1"}}\n\n',
  anthropicDelta: 'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}\n\n',
  anthropicStop: 'event: message_stop\ndata: {"type":"message_stop"}\n\n',
  multi: 'data: {"a":1}\n\ndata: {"b":2}\n\ndata: [DONE]\n\n',
};
