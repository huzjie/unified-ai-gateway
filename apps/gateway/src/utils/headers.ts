/**
 * 透传/受限头
 */
export const restrictedHeaders = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'host',
  'content-length',
  'transfer-encoding',
  'connection',
]);

/** 构建透传头（过滤受限头） */
export function buildPassthroughHeaders(headers: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (!restrictedHeaders.has(key.toLowerCase())) {
      result[key] = value;
    }
  }
  return result;
}
