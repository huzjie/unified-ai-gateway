import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError, ErrorCode } from '@uag/core';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * 管理面 JWT 鉴权
 */
export function createAdminAuth(_runtime: RuntimeRegistry) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    try {
      const decoded = await request.jwtVerify();
      request.adminUser = (decoded as { username?: string }).username ?? '';
    } catch {
      throw new AppError(ErrorCode.JWT_INVALID, 'Unauthorized: 登录已过期或无效');
    }
  };
}

export function adminAuthMiddleware(runtime: RuntimeRegistry) {
  return createAdminAuth(runtime);
}
