import type { RouteStrategy } from '../common/status';
import type { ISODateTime } from '../common/timestamp';

/** 路由规则实体 */
export interface RouteRuleEntity {
  id: string;
  name: string;
  /** 数字越小优先级越高 */
  priority: number;
  /** 匹配条件：模型名（支持 * 通配） */
  matchModel: string | null;
  /** 匹配条件：租户（支持 * 通配） */
  matchTenant: string | null;
  /** 路由策略 */
  strategy: RouteStrategy;
  /** 有序 Provider 候选（JSON 序列化） */
  targets: string[];
  /** 故障转移后备候选 */
  fallbackTargets: string[];
  /** 熔断阈值（默认 0.5） */
  breakerThreshold: number;
  enabled: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** 新建路由规则 */
export interface NewRouteRule {
  name: string;
  priority?: number;
  matchModel?: string | null;
  matchTenant?: string | null;
  strategy?: RouteStrategy;
  targets: string[];
  fallbackTargets?: string[];
  breakerThreshold?: number;
  enabled?: boolean;
}

/** 路由规则更新补丁 */
export interface RouteRulePatch {
  name?: string;
  priority?: number;
  matchModel?: string | null;
  matchTenant?: string | null;
  strategy?: RouteStrategy;
  targets?: string[];
  fallbackTargets?: string[];
  breakerThreshold?: number;
  enabled?: boolean;
}
