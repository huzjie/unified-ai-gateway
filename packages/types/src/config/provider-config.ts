import type { ProviderPriceEntry } from '../provider/provider-config';

/** Provider 配置 schema 类型（YAML/JSON 配置文件声明） */
export interface ProviderConfigSchema {
  /** 配置名（唯一） */
  name: string;
  /** Provider 类型 */
  type: 'openai' | 'moonshot' | 'deepseek' | 'minimax' | 'anthropic' | 'ollama' | 'mock';
  /** Base URL */
  baseUrl: string;
  /** API Key（可选，ollama/mock 可无） */
  apiKey?: string;
  /** 模型清单 */
  models?: string[];
  /** 计价表 */
  pricing?: Record<string, ProviderPriceEntry>;
  /** 请求超时（ms） */
  timeoutMs?: number;
  /** 重试次数 */
  maxRetries?: number;
  /** 是否启用 */
  enabled?: boolean;
}

/** 路由规则配置文件 schema */
export interface RouteRuleConfigSchema {
  name: string;
  priority?: number;
  matchModel?: string;
  matchTenant?: string;
  strategy?: 'priority' | 'failover' | 'cost-first' | 'random';
  targets: string[];
  fallbackTargets?: string[];
  breakerThreshold?: number;
  enabled?: boolean;
}

/** 配置文件（gateway.config.yaml/json） */
export interface ConfigFileSchema {
  providers?: ProviderConfigSchema[];
  aliases?: Record<string, string[]>;
  routeRules?: RouteRuleConfigSchema[];
  rateLimit?: Partial<{
    globalQps: number;
    globalBurst: number;
    globalConcurrency: number;
    algorithm: string;
    windowMs: number;
  }>;
  circuitBreaker?: Partial<{
    failureThreshold: number;
    minRequests: number;
    openMs: number;
    halfOpenRatio: number;
  }>;
}

export type { ProviderPriceEntry };
