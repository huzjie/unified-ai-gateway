import type { Candidate } from './types';
import type { BreakerDecision, BreakerState } from '@uag/types';

/**
 * 结合熔断健康度的候选过滤
 */
export interface BreakerLookup {
  allow(providerKey: string): BreakerDecision;
  getState(providerKey: string): BreakerState;
}

export class HealthAwareFilter {
  constructor(private readonly breaker: BreakerLookup) {}

  /** 过滤出可放行的候选（CLOSED/HALF_OPEN 且未 OPEN） */
  filterHealthy(candidates: Candidate[]): Candidate[] {
    return candidates.filter((c) => this.isHealthy(c.provider));
  }

  /** 该 Provider 当前是否可放行 */
  isHealthy(providerKey: string): boolean {
    const decision = this.breaker.allow(providerKey);
    return decision.allowed;
  }

  /** 获取熔断状态 */
  getState(providerKey: string): BreakerState {
    return this.breaker.getState(providerKey);
  }
}
