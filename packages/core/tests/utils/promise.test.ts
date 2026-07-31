import { promiseSettle, promiseRaceWithTimeout, deferred } from '../../src/utils/promise';

describe('promise utils', () => {
  it('promiseSettle 不抛错', async () => {
    const results = await promiseSettle([Promise.resolve(1), Promise.reject(new Error('x'))]);
    expect(results[0]).toEqual({ status: 'fulfilled', value: 1 });
    expect(results[1].status).toBe('rejected');
  });

  it('promiseRaceWithTimeout 超时回退', async () => {
    const result = await promiseRaceWithTimeout(delay(100).then(() => 'slow'), 10, 'fallback');
    expect(result).toBe('fallback');
  });

  it('deferred', async () => {
    const d = deferred<number>();
    d.resolve(42);
    await expect(d.promise).resolves.toBe(42);
  });
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
