import type { ApiKeyCreateResult, ApiKeyEntity, KeyFilter, KeyPatch, NewApiKey, Page, PageResult } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';
import { AppError, ErrorCode } from '@uag/core';
import { KeyHasher, KeyGenerator } from '@uag/storage';

/**
 * Key 生命周期管理
 */
export class KeyService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 创建 Key（明文仅此一次返回） */
  createKey(input: NewApiKey): ApiKeyCreateResult {
    const { plain, keyPrefix } = KeyGenerator.generate('live');
    const { salt, hash } = KeyHasher.hash(plain);
    const entity = this.runtime.repos.apiKey.create({
      ...input,
      keyHash: KeyHasher.combine(salt, hash),
      salt,
      keyPrefix,
    });
    // 建立明文→存储哈希索引（内存，用于鉴权查询）
    this.runtime.keyHashIndex.set(plain, KeyHasher.combine(salt, hash));
    this.runtime.auditService.record('api_key', 'key.create', entity.id, 'success', { name: input.name, tenant: input.tenant });
    return { key: entity, plainKey: plain };
  }

  /** 列表 */
  list(filter: KeyFilter, page: Page): PageResult<ApiKeyEntity> {
    return this.runtime.repos.apiKey.list(filter, page);
  }

  /** 吊销 */
  revoke(id: string): ApiKeyEntity {
    const key = this.runtime.repos.apiKey.findById(id);
    if (!key) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Key 不存在');
    }
    this.runtime.repos.apiKey.revoke(id, new Date().toISOString());
    this.runtime.auditService.record('api_key', 'key.revoke', id, 'success', {});
    return this.runtime.repos.apiKey.findById(id)!;
  }

  /** 更新 */
  update(id: string, patch: KeyPatch): ApiKeyEntity {
    const key = this.runtime.repos.apiKey.findById(id);
    if (!key) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Key 不存在');
    }
    this.runtime.auditService.record('api_key', 'key.update', id, 'success', {});
    return this.runtime.repos.apiKey.update(id, patch);
  }
}
