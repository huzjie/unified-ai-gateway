import type { RequestContext, RouteRuleEntity } from '@uag/types';

/**
 * 模型 / 租户 / Key 匹配器
 * 规则匹配：matchModel 与 matchTenant 均为空 → 匹配所有；
 * 支持 * 通配（前缀通配，如 deepseek*）。
 */
export class ContextMatcher {
  /** 规则是否匹配请求上下文 */
  match(rule: RouteRuleEntity, ctx: RequestContext): boolean {
    if (!rule.enabled) {
      return false;
    }
    if (rule.matchModel && !this.matchPattern(rule.matchModel, ctx.virtualModel)) {
      return false;
    }
    if (rule.matchTenant && !this.matchPattern(rule.matchTenant, ctx.tenant)) {
      return false;
    }
    return true;
  }

  /** 通配符匹配（* 支持前缀与后缀） */
  matchPattern(pattern: string, value: string): boolean {
    if (pattern === '*' || pattern === value) {
      return true;
    }
    if (pattern.endsWith('*')) {
      return value.startsWith(pattern.slice(0, -1));
    }
    if (pattern.startsWith('*')) {
      return value.endsWith(pattern.slice(1));
    }
    return false;
  }
}
