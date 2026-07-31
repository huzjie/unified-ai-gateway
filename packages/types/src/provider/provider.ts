import type { EnabledStatus, HealthStatus, ProviderType } from '../common/status';
import type { ISODateTime } from '../common/timestamp';

/** Provider 实体 */
export interface ProviderEntity {
  id: string;
  /** 配置名（唯一，如 'moonshot-prod'） */
  name: string;
  type: ProviderType;
  baseUrl: string;
  /** 加密后的 API Key（AES-256-GCM），管理面展示时脱敏 */
  encryptedApiKey: string | null;
  /** 模型清单（JSON 序列化） */
  models: string[];
  /** 计价表（JSON 序列化） */
  pricing: Record<string, unknown>;
  timeoutMs: number;
  maxRetries: number;
  enabled: EnabledStatus;
  healthStatus: HealthStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** 新建 Provider 输入 */
export interface NewProvider {
  name: string;
  type: ProviderType;
  baseUrl: string;
  apiKey?: string;
  models?: string[];
  pricing?: Record<string, unknown>;
  timeoutMs?: number;
  maxRetries?: number;
  enabled?: EnabledStatus;
}

/** Provider 更新补丁 */
export interface ProviderPatch {
  name?: string;
  baseUrl?: string;
  apiKey?: string;
  models?: string[];
  pricing?: Record<string, unknown>;
  timeoutMs?: number;
  maxRetries?: number;
  enabled?: EnabledStatus;
}
