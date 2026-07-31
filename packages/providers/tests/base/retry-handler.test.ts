import { RetryHandler } from '../../src/base/retry-handler';
import { AppError, ErrorCode } from '@uag/core';

describe('RetryHandler', () => {
  const handler = new RetryHandler(2);

  it('成功不重试', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    await expect(handler.execute(fn)).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('可重试错误重试', async () => {
    const fn = jest.fn().mockRejectedValueOnce(new AppError(ErrorCode.PROVIDER_UNAVAILABLE)).mockResolvedValue('ok');
    await expect(handler.execute(fn)).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('isRetryable 判定', () => {
    expect(handler.isRetryable(new AppError(ErrorCode.PROVIDER_UNAVAILABLE))).toBe(true);
    expect(handler.isRetryable(new AppError(ErrorCode.API_KEY_INVALID))).toBe(false);
    expect(handler.isRetryable(new Error('socket timeout'))).toBe(true);
    expect(handler.isRetryable(new Error('plain'))).toBe(false);
  });

  it('maxRetries=0 不重试', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('x'));
    await expect(handler.execute(fn, 0)).rejects.toThrow('x');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
