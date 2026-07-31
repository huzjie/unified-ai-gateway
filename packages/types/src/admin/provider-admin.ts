import type { ProviderEntity } from '../provider/provider';

/**
 * 管理面 Provider 视图
 * 相比 ProviderEntity，API Key 始终脱敏展示。
 */
export interface ProviderAdminView extends Omit<ProviderEntity, 'encryptedApiKey'> {
  /** 脱敏 Key（如 sk-***abc） */
  apiKeyMasked: string;
  /** 是否有 Key 配置 */
  hasApiKey: boolean;
}

/** Provider 连通性测试结果 */
export interface ProviderTestResult {
  ok: boolean;
  latencyMs: number;
  message: string;
  models: string[];
}
