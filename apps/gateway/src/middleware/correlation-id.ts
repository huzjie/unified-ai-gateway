import type { FastifyReply, FastifyRequest } from 'fastify';
import { generateCorrelationId } from '@uag/core';

/**
 * 关联 ID 中间件（若插件未设置则补发）
 */
export async function correlationIdMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!request.headers['x-request-id']) {
    const cid = generateCorrelationId();
    request.headers['x-request-id'] = cid;
    reply.header('x-request-id', cid);
  }
}
