import type { ModelInfo } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';

/**
 * 可用模型目录（聚合各 Provider）
 */
export class ModelCatalogService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 全部可用模型 */
  async list(): Promise<ModelInfo[]> {
    const models: ModelInfo[] = [];
    // 已注册 Provider 的模型
    for (const adapter of this.runtime.providers.list()) {
      try {
        const providerModels = await adapter.listModels();
        for (const pm of providerModels) {
          models.push({
            id: pm.id,
            object: 'model',
            created: Math.floor(Date.now() / 1000),
            owned_by: adapter.name,
            capabilities: pm.capabilities,
          });
        }
      } catch {
        // 忽略单个 Provider 失败
      }
    }
    // 虚拟模型别名
    for (const alias of this.runtime.aliasManager.list()) {
      models.push({
        id: alias.name,
        object: 'model',
        created: Math.floor(Date.now() / 1000),
        owned_by: 'alias',
        capabilities: { chat: true, streaming: true },
      });
    }
    return models;
  }
}
