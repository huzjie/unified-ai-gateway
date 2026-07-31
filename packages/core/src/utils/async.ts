/**
 * 并发 / 超时 / 节流工具
 */

/** 延迟 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 带超时的 Promise（超时 reject） */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message = 'Operation timed out'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/** 节流（leading 触发） */
export function throttle<T extends (...args: never[]) => void>(fn: T, waitMs: number): T {
  let last = 0;
  return ((...args: never[]) => {
    const now = Date.now();
    if (now - last >= waitMs) {
      last = now;
      fn(...args);
    }
  }) as T;
}

/** 防抖 */
export function debounce<T extends (...args: never[]) => void>(fn: T, waitMs: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: never[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), waitMs);
  }) as T;
}

/** 并发限制器 */
export function pLimit(limit: number): <T>(fn: () => Promise<T>) => Promise<T> {
  let active = 0;
  const queue: Array<() => void> = [];

  const next = (): void => {
    active -= 1;
    queue.shift()?.();
  };

  return function run<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const execute = (): void => {
        active += 1;
        fn().then(
          (value) => {
            next();
            resolve(value);
          },
          (err) => {
            next();
            reject(err);
          },
        );
      };
      if (active < limit) {
        execute();
      } else {
        queue.push(execute);
      }
    });
  };
}

/** 限制并发地映射数组 */
export async function rateLimitedMap<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  limit: number,
): Promise<R[]> {
  const limiter = pLimit(limit);
  return Promise.all(items.map((item, index) => limiter(() => fn(item, index))));
}
