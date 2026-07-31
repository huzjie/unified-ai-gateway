import type { ApiKeyEntity, KeyFilter, KeyPatch, NewApiKey, Page, PageResult } from '@uag/types';

export interface IApiKeyRepository {
  create(input: NewApiKey & { keyHash: string; salt: string; keyPrefix: string }): ApiKeyEntity;
  findByHash(hash: string): Promise<ApiKeyEntity | null> | ApiKeyEntity | null;
  findById(id: string): ApiKeyEntity | null;
  list(filter: KeyFilter, page: Page): PageResult<ApiKeyEntity>;
  revoke(id: string, at: string): void;
  update(id: string, patch: KeyPatch): ApiKeyEntity;
  touchLastUsed(id: string, at: string): void;
}
