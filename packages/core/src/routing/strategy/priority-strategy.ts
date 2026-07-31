import type { Candidate } from '../types';
import { BaseStrategy } from './base-strategy';

/**
 * 优先级策略（primary/fallback）
 * 直接选择候选列表第一个健康候选。
 */
export class PriorityStrategy extends BaseStrategy {
  readonly name = 'priority';

  pick(candidates: Candidate[]): Candidate {
    if (candidates.length === 0) {
      throw new Error('PriorityStrategy.pick: 候选列表为空');
    }
    const healthyList = this.healthy(candidates);
    if (healthyList.length === 0) {
      return candidates[0];
    }
    return healthyList[0];
  }
}
