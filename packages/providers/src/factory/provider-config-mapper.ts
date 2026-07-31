import type { ProviderEntity } from '@uag/types';
import type { AdapterConfig } from './provider-factory';

/**
 * 存储配置 → 适配器配置
 */
export class ProviderConfigMapper {
  /** 从 ProviderEntity 构造适配器配置 */
  map(entity: ProviderEntity, decryptedApiKey: string | null): AdapterConfig {
    const base = {
      name: entity.name,
      baseUrl: entity.baseUrl,
      apiKey: decryptedApiKey ?? entity.encryptedApiKey,
      models: entity.models,
      timeoutMs: entity.timeoutMs,
      maxRetries: entity.maxRetries,
    };
    return { ...base, type: entity.type } as AdapterConfig;
  }

  /** 从创建输入构造适配器配置 */
  mapFromInput(input: {
    name: string;
    type: AdapterConfig['type'];
    baseUrl: string;
    apiKey?: string;
    models?: string[];
    timeoutMs?: number;
    maxRetries?: number;
  }): AdapterConfig {
    const base = {
      name: input.name,
      baseUrl: input.baseUrl,
      apiKey: input.apiKey ?? null,
      models: input.models ?? [],
      timeoutMs: input.timeoutMs ?? 30000,
      maxRetries: input.maxRetries ?? 2,
    };
    return { ...base, type: input.type } as AdapterConfig;
  }
}
