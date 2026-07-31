import type { FailReason, RouteDecision } from '@uag/types';

export type { FailReason, RouteDecision } from '@uag/types';

/** 路由候选（含元数据，供策略决策） */
export interface Candidate {
  /** Provider 配置名 */
  provider: string;
  /** 实际模型名 */
  model: string;
  /** 输入单价（元/1K tokens） */
  inputPrice?: number;
  /** 输出单价（元/1K tokens） */
  outputPrice?: number;
  /** 权重（random 策略） */
  weight?: number;
  /** 是否健康（熔断/健康检查） */
  healthy?: boolean;
  /** 附加元数据 */
  meta?: Record<string, unknown>;
}

/** 路由引擎接口 */
export interface RouterEngine {
  /** 根据请求上下文解析出首个路由决策 */
  resolve(ctx: import('@uag/types').RequestContext): RouteDecision;
  /** 前一个决策失败后取下一个候选（故障转移核心）；无候选返回 null */
  nextCandidate(prev: RouteDecision, reason: FailReason): RouteDecision | null;
}
