import type { NewProvider, Page, PageResult, ProviderEntity, ProviderPatch } from '@uag/types';

export interface IProviderRepository {
  create(input: NewProvider & { encryptedApiKey: string | null }): ProviderEntity;
  findById(id: string): ProviderEntity | null;
  findByName(name: string): ProviderEntity | null;
  list(filter: { type?: string; enabled?: boolean; search?: string }, page: Page): PageResult<ProviderEntity>;
  listAll(): ProviderEntity[];
  update(id: string, patch: ProviderPatch & { encryptedApiKey?: string | null }): ProviderEntity;
  delete(id: string): void;
  updateHealth(id: string, status: string): void;
}
