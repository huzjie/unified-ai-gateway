import type { FastifyInstance } from 'fastify';

/**
 * 响应压缩（gzip/brotli）
 */
export function registerCompression(server: FastifyInstance): void {
  void server.register(require('@fastify/compress'), {
    global: true,
  });
}
