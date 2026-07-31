/**
 * 统一响应格式
 * 管理面：{ code: 0, data: T, message: 'ok' }
 */
export function formatApiResponse<T>(data: T, message = 'ok'): { code: number; data: T; message: string } {
  return { code: 0, data, message };
}

export function formatErrorResponse(code: string, message: string, details?: unknown): Record<string, unknown> {
  return { code, message, ...(details !== undefined ? { details } : {}) };
}
