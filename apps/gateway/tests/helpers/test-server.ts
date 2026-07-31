import { buildServer } from '../../src/server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';

/**
 * 测试 Fastify 实例工厂
 */
export async function createTestServer(
  runtime: RuntimeRegistry,
): Promise<FastifyInstance> {
  const server = buildServer(runtime);
  await server.ready();
  return server;
}

export async function closeTestServer(server: FastifyInstance): Promise<void> {
  await server.close();
}
