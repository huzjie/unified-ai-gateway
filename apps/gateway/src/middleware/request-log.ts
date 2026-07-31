import type { FastifyReply, FastifyRequest } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * 请求日志埋点（事件总线）
 */
export function createRequestLog(runtime: RuntimeRegistry) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    runtime.eventBus.publish(
      'request_started',
      { model: (request.body as { model?: string } | undefined)?.model ?? '', url: request.url },
      String(request.headers['x-request-id']),
    );
  };
}

export function requestLogMiddleware(runtime: RuntimeRegistry) {
  return createRequestLog(runtime);
}
