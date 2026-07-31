export interface ApiKey {
  id: string;
  name: string;
  tenant: string;
  keyPrefix: string;
  status: 'active' | 'revoked' | 'expired';
  modelWhitelist: string[];
  qpsLimit: number;
  concurrencyLimit: number;
  monthlyQuotaTokens: number;
  monthlyQuotaAmount: number;
  expiresAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface ApiKeyCreateInput {
  name: string;
  tenant: string;
  modelWhitelist?: string[];
  qpsLimit?: number;
  concurrencyLimit?: number;
  monthlyQuotaTokens?: number;
  monthlyQuotaAmount?: number;
  expiresAt?: string | null;
}

export interface ApiKeyCreateResult {
  key: ApiKey;
  plainKey: string;
}
