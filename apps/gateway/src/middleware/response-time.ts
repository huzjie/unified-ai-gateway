import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * 耗时统计（设置 x-uag-latency 头）
 */
export async function responseTimeMiddleware(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const start = Date.now();
  reply.raw.on('finish', () => {
    const elapsed = Date.now() - start;
    reply.header('x-uag-latency', String(elapsed));
  });
}
