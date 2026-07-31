/**
 * 安全 JSON 序列化
 */

/** 安全解析 JSON（失败返回 fallback） */
export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/** 安全序列化（循环引用/异常返回 fallback） */
export function safeJsonStringify(value: unknown, fallback = ''): string {
  try {
    return JSON.stringify(value) ?? fallback;
  } catch {
    return fallback;
  }
}

/** 是否为 JSON 对象（非数组、非 null） */
export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 深解析（处理嵌套 JSON 字符串） */
export function deepJsonParse(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return deepJsonParse(JSON.parse(value));
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) {
    return value.map(deepJsonParse);
  }
  if (isJsonObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepJsonParse(v);
    }
    return out;
  }
  return value;
}
