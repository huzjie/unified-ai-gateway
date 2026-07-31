import type { QuotaUsageEntity } from '../quota-repository';

export interface IQuotaRepository {
  get(tenant: string, period?: string): QuotaUsageEntity | null;
  addUsage(tenant: string, tokens: number, amount: number, period?: string): QuotaUsageEntity;
  reset(tenant: string, period: string): void;
}
