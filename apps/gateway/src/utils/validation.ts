import { AppError, ErrorCode } from '@uag/core';

/** 请求体校验 */
export function validateBody(body: unknown, required: string[]): void {
  if (!body || typeof body !== 'object') {
    throw new AppError(ErrorCode.VALIDATION_FAILED, '请求体必须为 JSON 对象');
  }
  const obj = body as Record<string, unknown>;
  for (const field of required) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      throw new AppError(ErrorCode.VALIDATION_FAILED, `缺少必填字段: ${field}`);
    }
  }
}
