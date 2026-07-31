import type { NewProvider, ProviderEntity, ProviderPatch } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';
import { AppError, ErrorCode } from '@uag/core';
import { CryptoService } from '@uag/storage';
import { ProviderConfigMapper, ProviderFactory } from '@uag/providers';

/**
 * Provider 管理 + 健康检查触发
 */
export class ProviderAdminService {
  private readonly crypto: CryptoService;
  private readonly factory = new ProviderFactory();
  private readonly mapper = new ProviderConfigMapper();

  constructor(private readonly runtime: RuntimeRegistry) {
    this.crypto = new CryptoService(runtime.config.providerKeyEncryptionKey);
  }

  /** 添加 Provider（加密存储 Key + 注册适配器） */
  async create(input: NewProvider): Promise<ProviderEntity> {
    if (this.runtime.providers.has(input.name) || this.runtime.repos.provider.findByName(input.name)) {
      throw new AppError(ErrorCode.VALIDATION_FAILED, `Provider ${input.name} 已存在`);
    }
    const encryptedApiKey = input.apiKey ? this.crypto.encrypt(input.apiKey) : null;
    const entity = this.runtime.repos.provider.create({ ...input, encryptedApiKey });
    await this.runtime.registerProviderAdapter(entity);
    this.runtime.auditService.record('provider', 'provider.create', entity.id, 'success', { name: input.name, type: input.type });
    return entity;
  }

  /** 列表 */
  list(filter: { type?: string; enabled?: boolean; search?: string }, page: { page: number; pageSize: number }) {
    return this.runtime.repos.provider.list(filter ?? {}, page);
  }

  /** 详情 */
  get(id: string): ProviderEntity {
    const entity = this.runtime.repos.provider.findById(id);
    if (!entity) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Provider 不存在');
    }
    return entity;
  }

  /** 更新（可选更新 Key） */
  async update(id: string, patch: ProviderPatch): Promise<ProviderEntity> {
    const entity = this.runtime.repos.provider.findById(id);
    if (!entity) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Provider 不存在');
    }
    const data: ProviderPatch & { encryptedApiKey?: string | null } = { ...patch };
    if (patch.apiKey !== undefined) {
      data.encryptedApiKey = patch.apiKey ? this.crypto.encrypt(patch.apiKey) : null;
      delete data.apiKey;
    }
    const updated = this.runtime.repos.provider.update(id, data);
    // 重注册适配器
    if (updated.enabled === 'enabled') {
      await this.runtime.registerProviderAdapter(updated);
    } else {
      this.runtime.providers.remove(updated.name);
    }
    this.runtime.auditService.record('provider', 'provider.update', id, 'success', {});
    return updated;
  }

  /** 删除 */
  remove(id: string): void {
    const entity = this.runtime.repos.provider.findById(id);
    if (!entity) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Provider 不存在');
    }
    this.runtime.repos.provider.delete(id);
    this.runtime.providers.remove(entity.name);
    this.runtime.auditService.record('provider', 'provider.delete', id, 'success', {});
  }

  /** 测试连接 */
  async test(id: string): Promise<{ ok: boolean; latencyMs: number; message: string; models: string[] }> {
    const entity = this.runtime.repos.provider.findById(id);
    if (!entity) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Provider 不存在');
    }
    const apiKey = entity.encryptedApiKey ? this.crypto.decrypt(entity.encryptedApiKey) : null;
    const adapter = this.factory.create(this.mapper.map(entity, apiKey));
    const startedAt = Date.now();
    try {
      const status = await adapter.healthCheck();
      const latencyMs = Date.now() - startedAt;
      const models = (await adapter.listModels()).map((m) => m.id);
      this.runtime.repos.provider.updateHealth(id, status);
      return { ok: status === 'healthy', latencyMs, message: `health=${status}`, models };
    } catch (err) {
      const latencyMs = Date.now() - startedAt;
      this.runtime.repos.provider.updateHealth(id, 'unhealthy');
      return { ok: false, latencyMs, message: err instanceof Error ? err.message : '连接失败', models: [] };
    }
  }
}
