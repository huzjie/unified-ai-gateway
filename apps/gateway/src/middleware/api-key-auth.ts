import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError, ErrorCode } from '@uag/core';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * Bearer Key 鉴权（哈希查询）
 * 解析 Authorization: Bearer sk-xxx → 哈希 → 查询 Key → 校验状态/过期 → 附加 request.apiKey
 */
export function createApiKeyAuth(runtime: RuntimeRegistry) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const auth = request.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new AppError(ErrorCode.API_KEY_INVALID, 'Missing API key');
    }
    const plain = auth.slice(7).trim();
    if (!plain) {
      throw new AppError(ErrorCode.API_KEY_INVALID, 'Empty API key');
    }
    const { KeyHasher } = require('@uag/storage');
    const stored = runtime.keyHashIndex.get(plain);
    if (!stored) {
      throw new AppError(ErrorCode.API_KEY_INVALID, 'Invalid API key');
    }
    // 校验哈希（索引存储的是 salt:hash 格式）
    const keyEntity = runtime.repos.apiKey.findByHash(stored);
    if (!keyEntity || !KeyHasher.verify(plain, stored)) {
      throw new AppError(ErrorCode.API_KEY_INVALID, 'Invalid API key');
    }
    if (keyEntity.status === 'revoked') {
      throw new AppError(ErrorCode.API_KEY_REVOKED, 'API key revoked');
    }
    if (keyEntity.expiresAt && keyEntity.expiresAt < new Date().toISOString()) {
      throw new AppError(ErrorCode.API_KEY_REVOKED, 'API key expired');
    }
    request.apiKey = keyEntity;
  };
}

export function apiKeyAuthMiddleware(runtime: RuntimeRegistry) {
  return createApiKeyAuth(runtime);
}
