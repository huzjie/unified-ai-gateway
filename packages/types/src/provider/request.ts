import type { ChatRequest } from '../gateway/chat-request';

export type { ProviderStreamEvent } from './stream-event';

/**
 * 归一化请求（OpenAI 兼容）
 * 适配器负责把归一化请求转换为各家原生协议。
 */
export interface ProviderChatParams {
  model: string;
  messages: ChatRequest['messages'];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stop?: string[];
  stream?: boolean;
  presencePenalty?: number;
  frequencyPenalty?: number;
  user?: string;
  tools?: unknown[];
  toolChoice?: unknown;
  /** 透传扩展字段 */
  extraBody?: Record<string, unknown>;
}

/** 归一化响应 */
export interface ProviderChatResult {
  id: string;
  model: string;
  provider: string;
  content: string;
  /** 若为空表示未提供 usage */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
  /** 原始上游响应（调试/审计） */
  raw?: unknown;
  createdAt: string;
}
