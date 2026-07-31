/**
 * 启用 / 禁用 / 健康状态枚举
 */
export type EnabledStatus = 'enabled' | 'disabled';

/** API Key 状态 */
export type KeyStatus = 'active' | 'revoked' | 'expired';

/** Provider 健康状态 */
export type HealthStatus = 'healthy' | 'unhealthy' | 'unknown' | 'checking';

/** 熔断状态 */
export type BreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/** 路由策略 */
export type RouteStrategy = 'priority' | 'failover' | 'cost-first' | 'random';

/** Provider 类型 */
export type ProviderType =
  | 'openai'
  | 'moonshot'
  | 'deepseek'
  | 'minimax'
  | 'anthropic'
  | 'ollama'
  | 'mock';

/** Token 角色 */
export type TokenRole = 'input' | 'output';
