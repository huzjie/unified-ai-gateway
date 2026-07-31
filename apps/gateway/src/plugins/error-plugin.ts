import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AppError, toOpenAIErrorBody, toAdminErrorBody } from '@uag/core';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * 全局错误处理器
 * /v1/* 返回 OpenAI 兼容错误；/admin/* 返回管理面错误。
 */
export function registerErrorPlugin(server: FastifyInstance, runtime: RuntimeRegistry): void {
  server.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    // Fastify schema 校验错误 → 400 Bad Request
    const isValidationError =
      (error as { validation?: unknown }).validation !== undefined ||
      (error as { statusCode?: number }).statusCode === 400;
    const status = isValidationError
      ? 400
      : AppError.isAppError(error)
        ? error.httpStatus
        : 500;

    if (AppError.isAppError(error)) {
      if (error.retryAfterMs) {
        reply.header('retry-after', Math.ceil(error.retryAfterMs / 1000));
      }
    }

    const path = request.url;
    if (path.startsWith('/v1/')) {
      const body = toOpenAIErrorBody(error);
      runtime.logger.warn({ code: body.error.code, status }, 'openai error response');
      return reply.status(status).send(body);
    }
    if (path.startsWith('/admin/')) {
      const body = toAdminErrorBody(error);
      runtime.logger.warn({ code: body.code, status }, 'admin error response');
      return reply.status(status).send(body);
    }
    const body = toOpenAIErrorBody(error);
    return reply.status(status).send(body);
  });
}
