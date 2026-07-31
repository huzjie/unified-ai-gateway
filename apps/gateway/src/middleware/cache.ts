import type { FastifyReply, FastifyRequest } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * 上下文缓存命中（P1）
 * 命中时直接返回缓存响应。
 */
export function createCacheMiddleware(runtime: RuntimeRegistry) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!runtime.settings.get().cacheEnabled) {
      return;
    }
    if (!request.url.startsWith('/v1/chat/completions') || request.method !== 'POST') {
      return;
    }
    const body = request.body as { model?: string; messages?: unknown[] };
    if (!body?.model || !body?.messages) {
      return;
    }
    const cacheKey = `ctx:${body.model}:${JSON.stringify(body.messages).slice(0, 2000)}`;
    const entry = runtime.repos.contextCache.get(cacheKey);
    if (entry) {
      runtime.repos.contextCache.hit(cacheKey);
      runtime.eventBus.publish('cache_hit', { cacheKey, model: body.model }, String(request.headers['x-request-id']));
      reply.header('x-uag-cache', 'HIT');
      return reply.send(entry.response);
    }
    runtime.eventBus.publish('cache_miss', { cacheKey, model: body.model }, String(request.headers['x-request-id']));
    (request as FastifyRequest & { uagCacheKey?: string }).uagCacheKey = cacheKey;
  };
}

export function cacheMiddleware(runtime: RuntimeRegistry) {
  return createCacheMiddleware(runtime);
}
