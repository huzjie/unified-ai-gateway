import type { FailReason, RequestContext, RouteDecision } from '@uag/types';
import type { Candidate, RouterEngine } from './types';
import { RouteResolver } from './route-resolver';
import { StrategyFactory } from './strategy/strategy-factory';

/**
 * 路由引擎
 * 职责：规则匹配 → 候选列表 → 策略选择 → 决策；故障转移时取下一个候选。
 */
export class RouterEngineImpl implements RouterEngine {
  constructor(
    private readonly resolver: RouteResolver,
    private readonly strategyFactory: StrategyFactory,
  ) {}

  /** 解析首个路由决策 */
  resolve(ctx: RequestContext): RouteDecision {
    const { rule, candidates } = this.resolver.resolve(ctx);
    if (candidates.length === 0) {
      return {
        ruleId: rule?.id ?? 'none',
        strategy: rule?.strategy ?? 'priority',
        provider: '',
        model: ctx.virtualModel,
        virtualModel: ctx.virtualModel,
        candidates: [],
        reason: 'no_candidates',
      };
    }

    const strategy = this.strategyFactory.create(rule?.strategy ?? 'priority');
    const picked = strategy.pick(candidates);

    const failoverChain = this.buildFailoverChain(candidates, picked);
    return {
      ruleId: rule?.id ?? 'default',
      strategy: rule?.strategy ?? 'priority',
      provider: picked.provider,
      model: picked.model,
      virtualModel: ctx.virtualModel,
      candidates: candidates.filter((c) => c.provider !== picked.provider).map((c) => c.provider),
      reason: `strategy=${strategy.name}:picked=${picked.provider}`,
      failoverChain,
    };
  }

  /** 取下一个候选 */
  nextCandidate(prev: RouteDecision, reason: FailReason): RouteDecision | null {
    if (prev.candidates.length === 0) {
      return null;
    }
    const nextProvider = prev.candidates[0];
    const remaining = prev.candidates.slice(1);
    // failoverChain 已含 nextProvider（首个候选）时避免重复追加
    const baseChain = prev.failoverChain ?? [prev.provider];
    const chain = baseChain[baseChain.length - 1] === nextProvider ? baseChain : [...baseChain, nextProvider];
    return {
      ...prev,
      provider: nextProvider,
      candidates: remaining,
      reason: `failover:${reason}:next=${nextProvider}`,
      failoverChain: chain,
    };
  }

  /** 构建故障转移链（展示用） */
  private buildFailoverChain(candidates: Candidate[], picked: Candidate): string[] {
    return [picked.provider, ...candidates.filter((c) => c.provider !== picked.provider).map((c) => c.provider)];
  }
}

export { RouterEngineImpl as RouterEngine };
