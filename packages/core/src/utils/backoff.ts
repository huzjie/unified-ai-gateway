export const DEFAULT_BACKOFF_BASE_MS = 200;
export const DEFAULT_BACKOFF_MAX_MS = 5000;
export const DEFAULT_BACKOFF_FACTOR = 2;

/**
 * 指数退避计算（不抖动）
 * attempt 从 0 起
 */
export function exponentialBackoff(
  baseMs: number = DEFAULT_BACKOFF_BASE_MS,
  maxMs: number = DEFAULT_BACKOFF_MAX_MS,
  attempt: number,
): number {
  const exp = Math.pow(DEFAULT_BACKOFF_FACTOR, attempt);
  return Math.min(maxMs, baseMs * exp);
}

/** full jitter 抖动 */
export function fullJitter(delayMs: number): number {
  return Math.floor(Math.random() * delayMs);
}

/** 计算退避（full jitter 指数退避） */
export function computeBackoff(
  baseMs: number = DEFAULT_BACKOFF_BASE_MS,
  maxMs: number = DEFAULT_BACKOFF_MAX_MS,
  attempt: number,
): number {
  const exp = exponentialBackoff(baseMs, maxMs, attempt);
  return fullJitter(exp) + 1;
}

/** 等间隔退避（无随机） */
export function fixedDelay(delayMs: number): number {
  return delayMs;
}
