import { ErrorCode, ErrorPayload, AdminErrorPayload } from '@uag/types';
import { AppError } from './app-error';

/**
 * 错误 → HTTP 状态/载荷映射
 */
export function mapErrorToHttpStatus(err: unknown): number {
  if (AppError.isAppError(err)) {
    return err.httpStatus;
  }
  return 500;
}

/** 转换为 OpenAI 兼容错误体 */
export function toOpenAIErrorBody(err: unknown): ErrorPayload {
  if (AppError.isAppError(err)) {
    return err.toOpenAIError() as ErrorPayload;
  }
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  return {
    error: {
      message,
      type: ErrorCode.INTERNAL_ERROR,
      param: null,
      code: ErrorCode.INTERNAL_ERROR,
    },
  };
}

/** 转换为管理面错误体 */
export function toAdminErrorBody(err: unknown): AdminErrorPayload {
  if (AppError.isAppError(err)) {
    return err.toAdminError();
  }
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  return {
    code: ErrorCode.INTERNAL_ERROR,
    message,
    ...(err instanceof Error && err.stack ? { details: err.stack } : {}),
  };
}

/** 是否可重试 */
export function isRetryableError(err: unknown): boolean {
  if (AppError.isAppError(err)) {
    return err.retryable;
  }
  return false;
}
