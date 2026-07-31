import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError, ErrorCode } from '@uag/core';

/**
 * 请求体校验（chat 请求）
 */
export async function bodyValidatorMiddleware(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  if (request.url.startsWith('/v1/chat/completions') && request.method === 'POST') {
    const body = request.body as { model?: unknown; messages?: unknown };
    if (!body || typeof body !== 'object') {
      throw new AppError(ErrorCode.VALIDATION_FAILED, '请求体必须为 JSON 对象');
    }
    if (!body.model || typeof body.model !== 'string') {
      throw new AppError(ErrorCode.VALIDATION_FAILED, 'model 必须为非空字符串');
    }
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      throw new AppError(ErrorCode.VALIDATION_FAILED, 'messages 必须为非空数组');
    }
  }
}
