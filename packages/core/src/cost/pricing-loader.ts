import type { PricingTable } from './pricing-table';
import { PricingTableImpl } from './pricing-table';
import { toPrice } from '@uag/types';

/** 配置中的计价条目 */
export interface PricingEntryConfig {
  input: number;
  output: number;
  perRequest?: number;
}

/**
 * 计价表加载器：从配置加载计价表
 * 支持模型级计价与通配默认价。
 */
export class PricingLoader {
  /** 从 Record<model, entry> 加载 */
  load(entries: Record<string, PricingEntryConfig>, defaultEntry?: PricingEntryConfig): PricingTableImpl {
    const prices: Record<string, ReturnType<typeof toPrice>> = {};
    for (const [model, entry] of Object.entries(entries)) {
      prices[model] = toPrice(entry);
    }
    const defaultPrice = defaultEntry ? toPrice(defaultEntry).input : { per1k: 0, perRequest: 0 };
    return new PricingTableImpl(prices as never, defaultPrice);
  }

  /** 从 Provider 配置加载（合并多 Provider 计价） */
  loadFromProviders(providers: Array<{ name: string; pricing: Record<string, PricingEntryConfig> }>): PricingTableImpl {
    const table = new PricingTableImpl();
    for (const provider of providers) {
      const loaded = this.load(provider.pricing);
      table.merge(loaded);
    }
    return table;
  }
}

export type { PricingTable };
