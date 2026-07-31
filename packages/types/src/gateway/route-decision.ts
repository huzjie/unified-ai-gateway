import type { RouteStrategy } from '../common/status';

/** 失败原因（故障转移触发） */
export type FailReason =
  | 'upstream_error'
  | 'upstream_timeout'
  | 'circuit_open'
  | 'rate_limited'
  | 'provider_unavailable'
  | 'invalid_response';

/** 路由决策结果 */
export interface RouteDecision {
  /** 命中的规则 id */
  ruleId: string;
  strategy: RouteStrategy;
  /** 选中的 Provider 配置名 */
  provider: string;
  /** 实际请求的模型名（别名解析后） */
  model: string;
  /** 业务侧虚拟模型名 */
  virtualModel: string;
  /** ���余候选（供故障转移） */
  candidates: string[];
  /** 决策原因（可观测） */
  reason: string;
  /** 故障转移链（如 'moonshot->deepseek'） */
  failoverChain?: string[];
}
