import type { FastifyInstance } from 'fastify';
import { generateRequestId } from '@uag/core';

/**
 * x-request-id 生成/透传
 */
export function registerRequestId(server: FastifyInstance): void {
  server.addHook('onRequest', async (request, reply) => {
    const existing = request.headers['x-request-id'];
    const requestId = typeof existing === 'string' && existing ? existing : generateRequestId();
    request.headers['x-request-id'] = requestId;
    reply.header('x-request-id', requestId);
  });
}
