/**
 * 连接/请求/慢响应超时管理
 */
export class TimeoutManager {
  constructor(private readonly defaultTimeoutMs = 30000) {}

  /** 计算实际超时（配置覆盖默认） */
  resolve(configured?: number): number {
    return configured && configured > 0 ? configured : this.defaultTimeoutMs;
  }

  /** 带超时的 Promise 包装 */
  withTimeout<T>(promise: Promise<T>, timeoutMs: number, message = '请求超时'): Promise<T> {
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
}
