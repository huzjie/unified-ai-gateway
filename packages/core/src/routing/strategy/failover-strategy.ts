import type { Candidate } from '../types';
import { BaseStrategy } from './base-strategy';

/**
 * 故障转移策略
 * 与 priority 类似，但更强调跳过失败 Provider（healthy=false 的候选直接排除）。
 */
export class FailoverStrategy extends BaseStrategy {
  readonly name = 'failover';

  pick(candidates: Candidate[]): Candidate {
    const healthyList = this.healthy(candidates);
    if (healthyList.length === 0) {
      // 全部不健康时也返回第一个，由调用方决定是否重试
      return candidates[0];
    }
    return healthyList[0];
  }
}
