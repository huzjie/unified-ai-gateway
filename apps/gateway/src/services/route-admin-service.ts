import type { NewRouteRule, RouteRuleEntity, RouteRulePatch } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';
import { AppError, ErrorCode } from '@uag/core';

/**
 * 路由规则管理
 */
export class RouteAdminService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  create(input: NewRouteRule): RouteRuleEntity {
    if (this.runtime.repos.routeRule.findByName(input.name)) {
      throw new AppError(ErrorCode.VALIDATION_FAILED, `路由规则 ${input.name} 已存在`);
    }
    const rule = this.runtime.repos.routeRule.create(input);
    this.runtime.reloadRouteRules();
    this.runtime.auditService.record('route', 'route.create', rule.id, 'success', { name: input.name });
    return rule;
  }

  list(filter: { enabled?: boolean; search?: string }, page: { page: number; pageSize: number }) {
    return this.runtime.repos.routeRule.list(filter ?? {}, page);
  }

  get(id: string): RouteRuleEntity {
    const rule = this.runtime.repos.routeRule.findById(id);
    if (!rule) {
      throw new AppError(ErrorCode.NOT_FOUND, '路由规则不存在');
    }
    return rule;
  }

  update(id: string, patch: RouteRulePatch): RouteRuleEntity {
    const rule = this.runtime.repos.routeRule.findById(id);
    if (!rule) {
      throw new AppError(ErrorCode.NOT_FOUND, '路由规则不存在');
    }
    const updated = this.runtime.repos.routeRule.update(id, patch);
    this.runtime.reloadRouteRules();
    this.runtime.auditService.record('route', 'route.update', id, 'success', {});
    return updated;
  }

  remove(id: string): void {
    const rule = this.runtime.repos.routeRule.findById(id);
    if (!rule) {
      throw new AppError(ErrorCode.NOT_FOUND, '路由规则不存在');
    }
    this.runtime.repos.routeRule.delete(id);
    this.runtime.reloadRouteRules();
    this.runtime.auditService.record('route', 'route.delete', id, 'success', {});
  }

  /** 干跑：给定请求看路由决策 */
  dryRun(model: string, tenant: string): unknown {
    const rules: RouteRuleEntity[] = this.runtime.repos.routeRule.listEnabled();
    const matched = rules.find((r) => {
      if (r.matchModel && !this.matchPattern(r.matchModel, model)) return false;
      if (r.matchTenant && !this.matchPattern(r.matchTenant, tenant)) return false;
      return true;
    });
    return {
      matched: matched ?? null,
      fallback: matched?.fallbackTargets ?? [],
      candidates: matched?.targets ?? [],
    };
  }

  private matchPattern(pattern: string, value: string): boolean {
    if (pattern === '*' || pattern === value) return true;
    if (pattern.endsWith('*')) return value.startsWith(pattern.slice(0, -1));
    if (pattern.startsWith('*')) return value.endsWith(pattern.slice(1));
    return false;
  }
}
