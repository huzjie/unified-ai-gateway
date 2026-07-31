import { computeBackoff } from './backoff';

/** 重试策略 */
export interface RetryPolicy {
  /** 最大重试次数 */
  maxRetries: number;
  /** 初始退避（ms） */
  baseDelayMs: number;
  /** 最大退避（ms） */
  maxDelayMs: number;
}

/** 重试选项 */
export interface RetryOptions {
  maxRetries: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  /** 是否可重试（默认全部可重试） */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** 是否幂等（非幂等只在连接类错误重试） */
  idempotent?: boolean;
  /** 日志钩子 */
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}

const DEFAULT_POLICY: RetryPolicy = { maxRetries: 2, baseDelayMs: 200, maxDelayMs: 5000 };

/**
 * 重试执行器（指数退避 + full jitter）
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const policy: RetryPolicy = {
    maxRetries: options.maxRetries,
    baseDelayMs: options.baseDelayMs ?? DEFAULT_POLICY.baseDelayMs,
    maxDelayMs: options.maxDelayMs ?? DEFAULT_POLICY.maxDelayMs,
  };

  let lastError: unknown;
  for (let attempt = 0; attempt <= policy.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const shouldRetry = options.shouldRetry ?? (() => true);
      const isLast = attempt >= policy.maxRetries;
      const isRetryable = options.idempotent === false ? isConnectionError(err) : true;
      if (isLast || !shouldRetry(err, attempt) || !isRetryable) {
        throw err;
      }
      const delayMs = computeBackoff(policy.baseDelayMs, policy.maxDelayMs, attempt);
      options.onRetry?.(err, attempt + 1, delayMs);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

/** 是否为连接类错误（可安全重试） */
function isConnectionError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes('socket') ||
      msg.includes('connection') ||
      msg.includes('network') ||
      msg.includes('timeout') ||
      msg.includes('econnreset') ||
      msg.includes('econnrefused') ||
      msg.includes('undici')
    );
  }
  return false;
}
