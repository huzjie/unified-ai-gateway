import type { FastifyReply, FastifyRequest } from 'fastify';
import { createRateLimitError, ErrorCode } from '@uag/core';
import type { RateLimitScope } from '@uag/types';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * 每 Key + 全局限流中间件
 */
export function createRateLimit(runtime: RuntimeRegistry) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    // 全局限流
    const globalScope: RateLimitScope = {
      kind: 'global',
      id: 'global',
      qps: runtime.settings.get().globalQps,
      burst: runtime.settings.get().globalQps * 2,
      concurrency: runtime.settings.get().globalConcurrency,
    };
    const globalResult = runtime.limiter.check(globalScope);
    if (!globalResult.allowed) {
      runtime.eventBus.publish('rate_limited', {
        requestId: String(request.headers['x-request-id']),
        scope: 'global',
        limitType: 'qps',
        retryAfterMs: globalResult.retryAfterMs,
      });
      throw createRateLimitError('qps', globalResult.retryAfterMs);
    }

    // 每 Key 限流
    if (request.apiKey) {
      const keyScope: RateLimitScope = {
        kind: 'key',
        id: request.apiKey.id,
        qps: request.apiKey.qpsLimit,
        burst: request.apiKey.qpsLimit * 2,
        concurrency: request.apiKey.concurrencyLimit,
      };
      const keyResult = runtime.limiter.check(keyScope);
      if (!keyResult.allowed) {
        runtime.eventBus.publish('rate_limited', {
          requestId: String(request.headers['x-request-id']),
          scope: `key:${request.apiKey.id}`,
          limitType: 'qps',
          retryAfterMs: keyResult.retryAfterMs,
          keyId: request.apiKey.id,
          tenant: request.apiKey.tenant,
        });
        throw createRateLimitError('qps', keyResult.retryAfterMs);
      }
    }
  };
}

export function rateLimitMiddleware(runtime: RuntimeRegistry) {
  return createRateLimit(runtime);
}

export { ErrorCode };
