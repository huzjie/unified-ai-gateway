import type { ApiKeyEntity } from '../admin/api-key';
import type { ChatRequest } from './chat-request';
import type { RouteDecision } from './route-decision';
import type { Usage } from './usage';
import type { CostAmount } from '../common/money';

/**
 * 请求上下文（鉴权 / 限流 / 路由贯穿整个请求生命周期）
 */
export interface RequestContext {
  /** 关联 ID（贯穿请求） */
  requestId: string;
  /** 认证的 API Key 实体 */
  apiKey: ApiKeyEntity | null;
  /** 租户 */
  tenant: string;
  /** 客户端 IP */
  ip: string;
  /** 虚拟模型名（业务侧） */
  virtualModel: string;
  /** 归一化请求载荷 */
  payload: ChatRequest;
  /** 路由决策（resolve 后填充） */
  routeDecision: RouteDecision | null;
  /** 用量（调用后填充） */
  usage: Usage;
  /** 成本（调用后填充） */
  cost: CostAmount | null;
  /** 是否流式 */
  stream: boolean;
  /** 额外头（透传） */
  headers: Record<string, string>;
  /** 时间戳 */
  startedAt: number;
}
