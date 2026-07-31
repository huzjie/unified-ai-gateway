import type { RequestContext, RouteRuleEntity } from '@uag/types';
import type { Candidate } from './types';
import { ContextMatcher } from './context-matcher';

/**
 * 规则匹配 → 候选列表
 * 从路由规则库中选出命中的规则，并将 targets 映射为候选列表。
 */
export interface RouteRuleSource {
  /** 获取所有启用的规则（按 priority 升序） */
  listEnabledRules(): RouteRuleEntity[];
  /** 获取 Provider 单价（成本优先策略使用） */
  getProviderInputPrice?(provider: string, model: string): number | undefined;
  getProviderOutputPrice?(provider: string, model: string): number | undefined;
  /** 获取 Provider 权重（random 策略） */
  getProviderWeight?(provider: string): number | undefined;
  /** 获取 Provider 健康状态 */
  isProviderHealthy?(provider: string): boolean;
  /** 将 Provider 候选映射为实际模型名 */
  resolveModel(provider: string, virtualModel: string): string;
}

export interface ResolvedRoute {
  rule: RouteRuleEntity | null;
  candidates: Candidate[];
}

export class RouteResolver {
  constructor(
    private readonly source: RouteRuleSource,
    private readonly matcher: ContextMatcher = new ContextMatcher(),
  ) {}

  /** 解析规则与候选 */
  resolve(ctx: RequestContext): ResolvedRoute {
    const rules = this.source.listEnabledRules();
    const matched = rules.find((rule) => this.matcher.match(rule, ctx));
    if (!matched) {
      return { rule: null, candidates: this.defaultCandidates(ctx) };
    }

    const candidates: Candidate[] = [];
    for (const provider of matched.targets) {
      const model = this.source.resolveModel(provider, ctx.virtualModel);
      candidates.push({
        provider,
        model,
        inputPrice: this.source.getProviderInputPrice?.(provider, model),
        outputPrice: this.source.getProviderOutputPrice?.(provider, model),
        weight: this.source.getProviderWeight?.(provider),
        healthy: this.source.isProviderHealthy?.(provider) ?? true,
      });
    }
    // 后备目标追加在候选末尾
    for (const provider of matched.fallbackTargets ?? []) {
      if (candidates.some((c) => c.provider === provider)) {
        continue;
      }
      const model = this.source.resolveModel(provider, ctx.virtualModel);
      candidates.push({
        provider,
        model,
        inputPrice: this.source.getProviderInputPrice?.(provider, model),
        outputPrice: this.source.getProviderOutputPrice?.(provider, model),
        weight: this.source.getProviderWeight?.(provider),
        healthy: this.source.isProviderHealthy?.(provider) ?? true,
      });
    }

    return { rule: matched, candidates };
  }

  /** 默认候选：所有健康 Provider 且支持该模型的 */
  private defaultCandidates(ctx: RequestContext): Candidate[] {
    const providers = this.allProviders();
    const candidates: Candidate[] = [];
    for (const provider of providers) {
      const model = this.source.resolveModel(provider, ctx.virtualModel);
      if (this.source.isProviderHealthy?.(provider) === false) {
        continue;
      }
      candidates.push({
        provider,
        model,
        inputPrice: this.source.getProviderInputPrice?.(provider, model),
        outputPrice: this.source.getProviderOutputPrice?.(provider, model),
        weight: this.source.getProviderWeight?.(provider),
        healthy: true,
      });
    }
    return candidates;
  }

  private allProviders(): string[] {
    // 通过 source 提供的额外方法获取全部 provider（若实现）
    const withListAll = this.source as unknown as { listAllProviders?: () => string[] };
    if (typeof withListAll.listAllProviders === 'function') {
      return withListAll.listAllProviders();
    }
    return [];
  }
}
