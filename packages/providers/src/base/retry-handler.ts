import { retry } from '@uag/core';
import { AppError } from '@uag/core';

/**
 * 上游重试（幂等请求才重试）
 * 5xx / 429 / 网络错误可重试；4xx 客户端错误不重试。
 */
export class RetryHandler {
  constructor(private readonly defaultMaxRetries = 2) {}

  /** 执行可重试调用 */
  async execute<T>(fn: () => Promise<T>, maxRetries?: number): Promise<T> {
    const retries = maxRetries ?? this.defaultMaxRetries;
    if (retries <= 0) {
      return fn();
    }
    return retry(fn, {
      maxRetries: retries,
      baseDelayMs: 200,
      maxDelayMs: 5000,
      shouldRetry: (err) => this.isRetryable(err),
    });
  }

  /** 是否可重试 */
  isRetryable(err: unknown): boolean {
    if (AppError.isAppError(err)) {
      return err.retryable;
    }
    if (err instanceof Error) {
      const msg = err.message.toLowerCase();
      return (
        msg.includes('timeout') ||
        msg.includes('socket') ||
        msg.includes('connection') ||
        msg.includes('network') ||
        msg.includes('econnreset')
      );
    }
    return false;
  }
}
