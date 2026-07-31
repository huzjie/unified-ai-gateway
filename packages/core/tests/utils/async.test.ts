import { delay, withTimeout, throttle, debounce, pLimit, rateLimitedMap } from '../../src/utils/async';

describe('async utils', () => {
  it('delay', async () => {
    const start = Date.now();
    await delay(20);
    expect(Date.now() - start).toBeGreaterThanOrEqual(15);
  });

  it('withTimeout 超时', async () => {
    await expect(withTimeout(delay(100), 10)).rejects.toThrow('timed out');
  });

  it('withTimeout 正常完成', async () => {
    await expect(withTimeout(delay(5).then(() => 'ok'), 100)).resolves.toBe('ok');
  });

  it('throttle 节流', () => {
    let count = 0;
    const fn = throttle(() => {
      count += 1;
    }, 50);
    fn();
    fn();
    fn();
    expect(count).toBe(1);
  });

  it('debounce 防抖', async () => {
    let count = 0;
    const fn = debounce(() => {
      count += 1;
    }, 30);
    fn();
    fn();
    await delay(50);
    expect(count).toBe(1);
  });

  it('pLimit 并发限制', async () => {
    const limit = pLimit(2);
    let active = 0;
    let max = 0;
    const tasks = Array.from({ length: 6 }, () =>
      limit(async () => {
        active += 1;
        max = Math.max(max, active);
        await delay(10);
        active -= 1;
      }),
    );
    await Promise.all(tasks);
    expect(max).toBeLessThanOrEqual(2);
  });

  it('rateLimitedMap', async () => {
    const result = await rateLimitedMap([1, 2, 3, 4], async (n) => n * 2, 2);
    expect(result).toEqual([2, 4, 6, 8]);
  });
});
