import { CostCalculator, PricingLoader, PricingTableImpl } from '@uag/core';
import type { GatewayConfig } from '@uag/types';

/**
 * 成本装配层（计价表加载）
 */
export class CostBootstrap {
  constructor(private readonly config: GatewayConfig) {}

  /** 加载计价表 */
  loadPricingTable(): PricingTableImpl {
    const loader = new PricingLoader();
    const providers = (this.config.providers ?? []).map((p) => ({
      name: p.name,
      pricing: (p.pricing ?? {}) as Record<string, { input: number; output: number; perRequest?: number }>,
    }));
    return loader.loadFromProviders(providers);
  }

  /** 创建成本计算器 */
  create(): CostCalculator {
    return new CostCalculator(this.loadPricingTable());
  }
}
