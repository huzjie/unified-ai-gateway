import { ErrorCode, ERROR_HTTP_STATUS, ERROR_RETRYABLE } from '@uag/types';
import { getErrorMessage } from './error-codes';

/**
 * AppError 基类（code/status/retryable）
 * 所有业务错误统一由此类表示，携带 UAG-XXXX 错误码。
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly retryable: boolean;
  readonly details?: unknown;
  /** 限流/熔断时的重试等待（ms） */
  readonly retryAfterMs?: number;

  constructor(
    code: ErrorCode,
    message?: string,
    options: { details?: unknown; retryAfterMs?: number; cause?: Error } = {},
  ) {
    super(message ?? getErrorMessage(code), { cause: options.cause });
    this.name = 'AppError';
    this.code = code;
    this.httpStatus = ERROR_HTTP_STATUS[code] ?? 500;
    this.retryable = ERROR_RETRYABLE[code] ?? false;
    this.details = options.details;
    this.retryAfterMs = options.retryAfterMs;
  }

  /** 是否为 AppError */
  static isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
  }

  /** 转换为 OpenAI 兼容错误体 */
  toOpenAIError() {
    return {
      error: {
        message: this.message,
        type: this.code,
        param: null,
        code: this.code,
      },
    };
  }

  /** 转换为管理面错误体 */
  toAdminError() {
    return {
      code: this.code,
      message: this.message,
      ...(this.details !== undefined ? { details: this.details } : {}),
    };
  }
}
