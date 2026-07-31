/**
 * SSE 帧类型（OpenAI 兼容格式）
 */
export interface SSEChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta?: {
      role?: string;
      content?: string | null;
      tool_calls?: unknown;
    };
    message?: {
      role: string;
      content: string | null;
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/** 上游 SSE 解析后的原始事件 */
export interface RawSSEEvent {
  event?: string;
  data: string;
  id?: string;
  retry?: number;
}
