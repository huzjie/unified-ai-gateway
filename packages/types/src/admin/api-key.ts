import type { KeyStatus } from '../common/status';
import type { ISODateTime } from '../common/timestamp';

/** API Key 实体（落库仅存哈希） */
export interface ApiKeyEntity {
  id: string;
  name: string;
  tenant: string;
  /** 不可逆哈希，格式 salt:hash */
  keyHash: string;
  /** 哈希 salt */
  salt: string;
  /** 明文前缀（展示用，如 sk-live-9a） */
  keyPrefix: string;
  status: KeyStatus;
  /** 模型白名单（空 = 全部允许） */
  modelWhitelist: string[];
  qpsLimit: number;
  concurrencyLimit: number;
  monthlyQuotaTokens: number;
  monthlyQuotaAmount: number;
  expiresAt: ISODateTime | null;
  createdAt: ISODateTime;
  lastUsedAt: ISODateTime | null;
  revokedAt: ISODateTime | null;
}

/** 新建 Key 输入 */
export interface NewApiKey {
  name: string;
  tenant: string;
  modelWhitelist?: string[];
  qpsLimit?: number;
  concurrencyLimit?: number;
  monthlyQuotaTokens?: number;
  monthlyQuotaAmount?: number;
  expiresAt?: ISODateTime | null;
}

/** Key 更新补丁 */
export interface KeyPatch {
  name?: string;
  modelWhitelist?: string[];
  qpsLimit?: number;
  concurrencyLimit?: number;
  monthlyQuotaTokens?: number;
  monthlyQuotaAmount?: number;
  expiresAt?: ISODateTime | null;
}

/** Key 创建结果（明文仅此一次返回） */
export interface ApiKeyCreateResult {
  key: ApiKeyEntity;
  /** 明文 Key（仅创建时返回一次，请立即保存） */
  plainKey: string;
}

/** Key 查询过滤 */
export interface KeyFilter {
  tenant?: string;
  status?: KeyStatus;
  search?: string;
}
