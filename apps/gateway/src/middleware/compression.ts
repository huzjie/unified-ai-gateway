import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * 响应压缩（gzip/brotli）
 * 由 @fastify/compress 全局处理；此处提供占位 hook 确保调用链完整。
 */
export async function compressionMiddleware(_request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  // handled by plugin
}
