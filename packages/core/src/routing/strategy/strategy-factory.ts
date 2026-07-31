import type { RouteStrategy } from '@uag/types';
import type { Strategy } from './base-strategy';
import { PriorityStrategy } from './priority-strategy';
import { FailoverStrategy } from './failover-strategy';
import { CostFirstStrategy } from './cost-first-strategy';
import { RandomStrategy } from './random-strategy';

/** 策略工厂配置 */
export interface StrategyConfig {
  /** 默认权重（random） */
  defaultWeight?: number;
}

/**
 * 策略工厂
 */
export class StrategyFactory {
  private readonly strategies: Record<RouteStrategy, Strategy>;

  constructor(_config: StrategyConfig = {}) {
    this.strategies = {
      priority: new PriorityStrategy(),
      failover: new FailoverStrategy(),
      'cost-first': new CostFirstStrategy(),
      random: new RandomStrategy(),
    };
  }

  /** 创建/获取策略（未知策略回退 priority） */
  create(strategy: RouteStrategy | string): Strategy {
    return this.strategies[strategy as RouteStrategy] ?? this.strategies.priority;
  }
}
