import { ErrorCode } from '@uag/types';
import { AppError, createError, createValidationError, createNotFoundError, createRateLimitError, createCircuitOpenError, mapErrorToHttpStatus, toOpenAIErrorBody, toAdminErrorBody } from '../src/errors';

describe('errors', () => {
  it('AppError 基本属性', () => {
    const err = new AppError(ErrorCode.API_KEY_INVALID, 'bad key');
    expect(err.code).toBe('UAG-2001');
    expect(err.httpStatus).toBe(401);
    expect(err.retryable).toBe(false);
    expect(err.message).toBe('bad key');
  });

  it('AppError 默认消息来自错误码表', () => {
    const err = new AppError(ErrorCode.NOT_FOUND);
    expect(err.message).toContain('不存在');
  });

  it('限流错误携带 retryAfterMs', () => {
    const err = createRateLimitError('qps', 1500);
    expect(err.code).toBe('UAG-3001');
    expect(err.httpStatus).toBe(429);
    expect(err.retryAfterMs).toBe(1500);
    expect(err.retryable).toBe(true);
  });

  it('熔断错误', () => {
    const err = createCircuitOpenError('moonshot-prod', 5000);
    expect(err.code).toBe('UAG-4003');
    expect(err.httpStatus).toBe(503);
    expect(err.retryAfterMs).toBe(5000);
  });

  it('校验/未找到错误', () => {
    expect(createValidationError('bad body').httpStatus).toBe(400);
    expect(createNotFoundError('no key').httpStatus).toBe(404);
  });

  it('createError 通用', () => {
    const err = createError(ErrorCode.UPSTREAM_TIMEOUT, 'timeout');
    expect(err.httpStatus).toBe(504);
    expect(err.retryable).toBe(true);
  });

  it('错误映射', () => {
    expect(mapErrorToHttpStatus(new AppError(ErrorCode.RATE_LIMITED))).toBe(429);
    expect(mapErrorToHttpStatus(new Error('boom'))).toBe(500);
    const openAI = toOpenAIErrorBody(new AppError(ErrorCode.API_KEY_INVALID));
    expect(openAI.error.code).toBe('UAG-2001');
    const admin = toAdminErrorBody(new Error('boom'));
    expect(admin.code).toBe('UAG-9001');
  });

  it('isAppError 判定', () => {
    expect(AppError.isAppError(new AppError(ErrorCode.SUCCESS))).toBe(true);
    expect(AppError.isAppError(new Error('x'))).toBe(false);
  });
});
