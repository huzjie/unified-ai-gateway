import type { FastifyRequest } from 'fastify';
import type { ApiKeyEntity } from '@uag/types';

/**
 * Fastify 装饰器类型增强
 */
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: import('fastify').FastifyReply) => Promise<void>;
    jwt: {
      sign(payload: Record<string, unknown>): string;
    };
  }
  interface FastifyRequest {
    /** 认证后的 API Key 实体（开放 API） */
    apiKey?: ApiKeyEntity | null;
    /** 认证后的管理员用户名（管理 API） */
    adminUser?: string;
    /** 校验 JWT 并返回载荷 */
    jwtVerify(): Promise<unknown>;
  }
}
