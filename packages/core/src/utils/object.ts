/**
 * 对象工具：深合并 / 掩码
 */

/** 是否为普通对象 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 深合并（后者覆盖前者，返回新对象） */
export function deepMerge<T extends Record<string, unknown>>(...objects: T[]): T {
  const result: Record<string, unknown> = {};
  for (const obj of objects) {
    if (!obj) {
      continue;
    }
    for (const [key, value] of Object.entries(obj)) {
      if (isPlainObject(value) && isPlainObject(result[key])) {
        result[key] = deepMerge(result[key] as Record<string, unknown>, value);
      } else {
        result[key] = value;
      }
    }
  }
  return result as T;
}

/** 选取指定字段 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/** 排除指定字段 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj } as Record<string, unknown>;
  for (const key of keys) {
    delete result[key as string];
  }
  return result as Omit<T, K>;
}

/** 掩码密钥（保留前后字符） */
export function maskSecret(secret: string, keepHead = 4, keepTail = 4): string {
  if (secret.length <= keepHead + keepTail) {
    return '***';
  }
  return `${secret.slice(0, keepHead)}${'*'.repeat(Math.min(12, secret.length - keepHead - keepTail))}${secret.slice(-keepTail)}`;
}

/** 掩码 API Key（如 sk-live-9a → sk-live-9a***） */
export function maskApiKey(key: string): string {
  if (key.length <= 10) {
    return maskSecret(key, 3, 0);
  }
  return `${key.slice(0, 10)}***`;
}

/** 深克隆（JSON 方式） */
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
