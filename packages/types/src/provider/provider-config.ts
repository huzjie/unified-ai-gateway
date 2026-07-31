import type { ProviderType } from '../common/status';

/**
 * Provider 配置（含加密字段标记）
 * 说明：apiKey 在落库前用 AES-256-GCM 加密，管理面只展示掩码。
 */
export interface ProviderConfig {
  /** 配置名 */
  name: string;
  type: ProviderType;
  baseUrl: string;
  /** 明文 API Key（仅创建/更新时使用，不落库明文） */
  apiKey?: string;
  /** 模型清单 */
  models: string[];
  /** 计价表（模型名 → 单价） */
  pricing: Record<string, ProviderPriceEntry>;
  /** 请求超时（ms） */
  timeoutMs: number;
  /** 最大重试次数 */
  maxRetries: number;
  enabled: boolean;
}

/** 单价条目（CNY / 1K tokens） */
export interface ProviderPriceEntry {
  /** 输入单价（元 / 1K tokens） */
  input: number;
  /** 输出单价（元 / 1K tokens） */
  output: number;
  /** 按请求固定费用（元/次），可选 */
  perRequest?: number;
}
