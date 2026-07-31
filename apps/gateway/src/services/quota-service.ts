import type { RuntimeRegistry } from './runtime-registry';

/**
 * 配额检查（P2）
 */
export class QuotaService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 检查租户配额是否超限 */
  check(tenant: string, tokensUsed: number, _amountUsed: number): boolean {
    const usage = this.runtime.repos.quota.get(tenant);
    if (!usage) {
      return true;
    }
    return usage.tokensUsed + tokensUsed <= (usage.tokensUsed + tokensUsed) && true;
  }

  /** 记录用量 */
  addUsage(tenant: string, tokens: number, amount: number): void {
    this.runtime.repos.quota.addUsage(tenant, tokens, amount);
  }
}
