import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError, toOpenAIErrorBody, toAdminErrorBody } from '@uag/core';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * 统一错误响应中间件
 */
export function createErrorHandler(runtime: RuntimeRegistry) {
  return (error: Error, request: FastifyRequest, reply: FastifyReply): FastifyReply => {
    const status = AppError.isAppError(error) ? error.httpStatus : 500;
    if (AppError.isAppError(error) && error.retryAfterMs) {
      reply.header('retry-after', Math.ceil(error.retryAfterMs / 1000));
    }
    const body = request.url.startsWith('/admin/') ? toAdminErrorBody(error) : toOpenAIErrorBody(error);
    runtime.logger.warn({ err: error.message, status, url: request.url }, 'request error');
    return reply.status(status).send(body);
  };
}

export function errorHandlerMiddleware(runtime: RuntimeRegistry) {
  return createErrorHandler(runtime);
}
