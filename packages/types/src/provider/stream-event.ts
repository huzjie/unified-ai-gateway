/**
 * 流事件类型（适配器 chatStream 产出）
 */
export type ProviderStreamEvent =
  | {
      type: 'chunk';
      /** OpenAI 兼容 SSE 块 */
      chunk: import('./sse').SSEChunk;
    }
  | {
      type: 'done';
      /** 聚合后的 usage（可选） */
      usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
    }
  | {
      type: 'error';
      error: Error;
      /** 是否可重试 */
      retryable: boolean;
    };
