/**
 * Promise 工具（settle/race）
 */

export interface SettledResult<T> {
  status: 'fulfilled' | 'rejected';
  value?: T;
  reason?: unknown;
}

/** 全部 settle（不抛错） */
export async function promiseSettle<T>(promises: Array<Promise<T>>): Promise<Array<SettledResult<T>>> {
  return Promise.all(
    promises.map(async (p) => {
      try {
        return { status: 'fulfilled' as const, value: await p };
      } catch (reason) {
        return { status: 'rejected' as const, reason };
      }
    }),
  );
}

/** 带超时的 race（超时返回 fallback） */
export async function promiseRaceWithTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    const timer = setTimeout(() => resolve(fallback), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      },
    );
  });
}

/** 延迟对象 */
export function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
