/**
 * OpenAI 兼容响应类型
 */
export interface OpenAICompatibleChatResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string | null;
      tool_calls?: unknown;
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  /** 网关扩展字段 */
  provider?: string;
  costMicro?: number;
}
