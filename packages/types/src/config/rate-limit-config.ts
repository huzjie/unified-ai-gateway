/** 限流算法类型 */
export type RateLimitAlgorithm = 'token-bucket' | 'fixed-window' | 'sliding-window';

/** 限流配置 */
export interface RateLimitConfig {
  /** 全局 QPS */
  globalQps: number;
  /** 全局突发容量 */
  globalBurst: number;
  /** 全局并发 */
  globalConcurrency: number;
  /** 默认算法 */
  algorithm: RateLimitAlgorithm;
  /** 窗口大小（ms，fixed/sliding 使用） */
  windowMs: number;
}

/** 限流作用域 */
export interface RateLimitScope {
  kind: 'global' | 'key' | 'tenant' | 'ip';
  id: string;
  qps: number;
  burst?: number;
  concurrency?: number;
}

/** 限流结果 */
export interface RateLimitResult {
  allowed: boolean;
  /** 拒绝时的重试等待（ms） */
  retryAfterMs: number;
  /** 剩余配额（QPS） */
  remaining: number;
  limit: number;
  /** 限流类型：qps / concurrency */
  limitType: 'qps' | 'concurrency';
}
