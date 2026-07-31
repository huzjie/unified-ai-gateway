import type { ISODateTime } from '../common/timestamp';
import type { ProviderChatResult } from './request';

/**
 * 归一化响应 + usage
 */
export interface ProviderResponse {
  result: ProviderChatResult;
  /** 归一化 usage（缺失时由 token-counter 估算） */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  statusCode: number;
  createdAt: ISODateTime;
}
