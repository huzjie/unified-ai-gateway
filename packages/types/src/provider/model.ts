import type { ISODateTime } from '../common/timestamp';

/** 模型能力标记 */
export interface ModelCapabilities {
  chat: boolean;
  streaming: boolean;
  vision?: boolean;
  embeddings?: boolean;
  functionCalling?: boolean;
  contextWindow?: number;
  maxOutputTokens?: number;
}

/** 模型实体（Provider 维度） */
export interface ProviderModel {
  /** 模型标识（Provider 原生名，如 'kimi-k3'） */
  id: string;
  /** 所属 Provider 配置名 */
  provider: string;
  /** 展示名 */
  name: string;
  capabilities: ModelCapabilities;
  /** 默认计价 */
  pricing?: {
    input: number;
    output: number;
    perRequest?: number;
  };
  createdAt?: ISODateTime;
}
