import { ErrorCode } from '@uag/types';
import { AppError } from './app-error';

/**
 * 按错误码构造错误
 */
export function createError(
  code: ErrorCode,
  message?: string,
  options: { details?: unknown; retryAfterMs?: number; cause?: Error } = {},
): AppError {
  return new AppError(code, message, options);
}

/** 校验失败错误 */
export function createValidationError(message: string, details?: unknown): AppError {
  return new AppError(ErrorCode.VALIDATION_FAILED, message, { details });
}

/** 资源不存在错误 */
export function createNotFoundError(message = '资源不存在', details?: unknown): AppError {
  return new AppError(ErrorCode.NOT_FOUND, message, { details });
}

/** 限流错误（附 Retry-After） */
export function createRateLimitError(
  limitType: 'qps' | 'concurrency',
  retryAfterMs: number,
  details?: unknown,
): AppError {
  return new AppError(
    limitType === 'qps' ? ErrorCode.RATE_LIMITED : ErrorCode.CONCURRENCY_LIMITED,
    limitType === 'qps' ? '请求过于频繁，触发 QPS 限流' : '并发数超限',
    { retryAfterMs, details },
  );
}

/** 熔断打开错误 */
export function createCircuitOpenError(providerKey: string, retryAfterMs: number): AppError {
  return new AppError(ErrorCode.CIRCUIT_OPEN, `Provider ${providerKey} 熔断打开`, {
    retryAfterMs,
    details: { providerKey },
  });
}

/** API Key 无效错误 */
export function createApiKeyInvalidError(): AppError {
  return new AppError(ErrorCode.API_KEY_INVALID, 'Invalid API key provided');
}
