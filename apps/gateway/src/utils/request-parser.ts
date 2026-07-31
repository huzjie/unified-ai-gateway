/**
 * 请求体/头解析
 */
export function parseRequestBody<T = unknown>(body: unknown): T {
  return body as T;
}

/** 解析 Authorization Bearer 头 */
export function parseAuthHeader(header: string | undefined): string | null {
  if (!header) {
    return null;
  }
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1].trim() : null;
}
