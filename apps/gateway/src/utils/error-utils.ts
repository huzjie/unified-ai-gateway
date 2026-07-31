import { AppError, ErrorCode } from '@uag/core';

/** 包装任意错误为 AppError */
export function wrapError(err: unknown): AppError {
  if (AppError.isAppError(err)) {
    return err;
  }
  const message = err instanceof Error ? err.message : String(err);
  return new AppError(ErrorCode.INTERNAL_ERROR, message);
}

export { AppError, ErrorCode };

/** 是否为 AppError */
export function isAppError(err: unknown): boolean {
  return AppError.isAppError(err);
}
