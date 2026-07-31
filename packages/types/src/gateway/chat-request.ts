/**
 * /v1/chat/completions 请求类型（OpenAI 兼容）
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | Array<Record<string, unknown>>;
  name?: string;
  tool_call_id?: string;
}

export interface ChatRequest {
  /** 模型名（可为虚拟模型名，由别名解析） */
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stop?: string | string[];
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
  user?: string;
  tools?: unknown[];
  tool_choice?: unknown;
  /** 透传扩展字段 */
  [key: string]: unknown;
}

/** Chat 请求上下文（鉴权后解析出的核心字段） */
export interface ChatRequestContext {
  /** 虚拟模型名（业务侧） */
  virtualModel: string;
  /** 实际模型名（别名解析后） */
  resolvedModel: string;
  request: ChatRequest;
  stream: boolean;
}
