import { retry } from '../../src/utils';

describe('retry', () => {
  it('首次成功不重试', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await retry(fn, { maxRetries: 3, baseDelayMs: 1 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('失败后重试成功', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValue('ok');
    const result = await retry(fn, { maxRetries: 3, baseDelayMs: 1, maxDelayMs: 5 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('超过最大重试抛错', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always'));
    await expect(retry(fn, { maxRetries: 2, baseDelayMs: 1, maxDelayMs: 2 })).rejects.toThrow('always');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('shouldRetry 控制', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('nope'));
    await expect(
      retry(fn, { maxRetries: 3, baseDelayMs: 1, shouldRetry: () => false }),
    ).rejects.toThrow('nope');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('onRetry 回调', async () => {
    const fn = jest.fn().mockRejectedValueOnce(new Error('x')).mockResolvedValue('ok');
    const onRetry = jest.fn();
    await retry(fn, { maxRetries: 2, baseDelayMs: 1, maxDelayMs: 2, onRetry });
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
