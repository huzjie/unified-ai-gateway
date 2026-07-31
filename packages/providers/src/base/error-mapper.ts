import { AppError, ErrorCode } from '@uag/core';

/**
 * 上游错误 → AppError（retryable 标记）
 * 5xx / 429 / 网络错误标记可重试；4xx 客户端错误不可重试。
 */
export class ErrorMapper {
  /** 从 HTTP 状态与响应体映射错误 */
  map(status: number, body: unknown, fallbackMessage = '上游请求失败'): AppError {
    const message = this.extractMessage(body) ?? fallbackMessage;

    if (status === 429) {
      return new AppError(ErrorCode.RATE_LIMITED, message, { retryAfterMs: 1000 });
    }
    // 408/504 需在 5xx 分支之前判断，否则 504 会落入 PROVIDER_UNAVAILABLE
    if (status === 408 || status === 504) {
      return new AppError(ErrorCode.UPSTREAM_TIMEOUT, message);
    }
    if (status >= 500) {
      return new AppError(ErrorCode.PROVIDER_UNAVAILABLE, message);
    }
    if (status === 401 || status === 403) {
      return new AppError(ErrorCode.UPSTREAM_ERROR, message);
    }
    return new AppError(ErrorCode.UPSTREAM_ERROR, message);
  }

  /** 从网络错误映射 */
  mapNetworkError(err: unknown): AppError {
    if (AppError.isAppError(err)) {
      return err;
    }
    const message = err instanceof Error ? err.message : '网络错误';
    if (message.toLowerCase().includes('timeout') || message.toLowerCase().includes('abort')) {
      return new AppError(ErrorCode.UPSTREAM_TIMEOUT, message);
    }
    return new AppError(ErrorCode.PROVIDER_UNAVAILABLE, message);
  }

  private extractMessage(body: unknown): string | null {
    if (!body || typeof body !== 'object') {
      return null;
    }
    const obj = body as Record<string, unknown>;
    if (obj.error && typeof obj.error === 'object') {
      const errObj = obj.error as Record<string, unknown>;
      if (typeof errObj.message === 'string') {
        return errObj.message;
      }
    }
    if (typeof obj.message === 'string') {
      return obj.message;
    }
    return null;
  }
}
