import type { FastifyInstance } from 'fastify';

/**
 * @fastify/sensible（HTTP 语义错误）
 */
export function registerSensible(server: FastifyInstance): void {
  void server.register(require('@fastify/sensible'));
}
