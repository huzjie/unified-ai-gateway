import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createApiKeyAuth } from '../middleware/api-key-auth';
import { createRateLimit } from '../middleware/rate-limit';
import { RequestContextBuilder } from '@uag/core';
import { chatSchemas } from './schema/chat.schema';

/** POST /v1/chat/completions */
export function registerChatRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  server.post('/v1/chat/completions', {
    schema: { body: chatSchemas.request },
    preHandler: [createApiKeyAuth(runtime), createRateLimit(runtime)],
  }, async (request, reply) => {
    const builder = new RequestContextBuilder();
    const ctx = builder.buildFromHttp({
      apiKey: request.apiKey,
      ip: request.ip,
      body: request.body as never,
      headers: request.headers as Record<string, string>,
      requestId: String(request.headers['x-request-id']),
    });

    // 模型白名单校验
    if (request.apiKey && request.apiKey.modelWhitelist.length > 0) {
      const { AppError, ErrorCode } = require('@uag/core');
      const allowed = request.apiKey.modelWhitelist.some((pattern) =>
        pattern === '*' || pattern === ctx.virtualModel || (pattern.endsWith('*') && ctx.virtualModel.startsWith(pattern.slice(0, -1))),
      );
      if (!allowed) {
        throw new AppError(ErrorCode.MODEL_NOT_ALLOWED, `模型 ${ctx.virtualModel} 不在 Key 白名单`);
      }
    }

    const stream = Boolean(ctx.payload.stream);
    if (stream) {
      reply.raw.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        connection: 'keep-alive',
        'x-request-id': ctx.requestId,
      });
      const frames = runtime.streamingService.handleStream(ctx);
      for await (const frame of frames) {
        reply.raw.write(frame);
      }
      reply.raw.end();
      return reply;
    }

    const result = await runtime.chatService.handleChat(ctx);
    reply.header('x-uag-provider', ctx.routeDecision?.provider ?? '');
    if (ctx.routeDecision?.failoverChain && ctx.routeDecision.failoverChain.length > 1) {
      reply.header('x-uag-failover', ctx.routeDecision.failoverChain.join('->'));
    }
    reply.header('x-uag-cost', String(ctx.cost?.micro ?? 0));
    return result;
  });
}
