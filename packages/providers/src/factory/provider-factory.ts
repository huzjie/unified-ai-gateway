import type { ProviderAdapter, ProviderType } from '@uag/types';
import { OpenAiProvider, type OpenAiProviderConfig } from '../openai/openai-provider';
import { MoonshotProvider, type MoonshotProviderConfig } from '../moonshot/moonshot-provider';
import { DeepSeekProvider, type DeepSeekProviderConfig } from '../deepseek/deepseek-provider';
import { MiniMaxProvider, type MiniMaxProviderConfig } from '../minimax/minimax-provider';
import { AnthropicProvider, type AnthropicProviderConfig } from '../anthropic/anthropic-provider';
import { OllamaProvider, type OllamaProviderConfig } from '../ollama/ollama-provider';
import { MockProvider, type MockProviderConfig } from '../mock/mock-provider';

/** 适配器配置（联合类型） */
export type AdapterConfig =
  | (OpenAiProviderConfig & { type: 'openai' })
  | (MoonshotProviderConfig & { type: 'moonshot' })
  | (DeepSeekProviderConfig & { type: 'deepseek' })
  | (MiniMaxProviderConfig & { type: 'minimax' })
  | (AnthropicProviderConfig & { type: 'anthropic' })
  | (OllamaProviderConfig & { type: 'ollama' })
  | (MockProviderConfig & { type: 'mock' });

/**
 * 按类型/配置创建适配器
 */
export class ProviderFactory {
  create(config: AdapterConfig): ProviderAdapter {
    switch (config.type) {
      case 'openai':
        return new OpenAiProvider(config as OpenAiProviderConfig);
      case 'moonshot':
        return new MoonshotProvider(config as MoonshotProviderConfig);
      case 'deepseek':
        return new DeepSeekProvider(config as DeepSeekProviderConfig);
      case 'minimax':
        return new MiniMaxProvider(config as MiniMaxProviderConfig);
      case 'anthropic':
        return new AnthropicProvider(config as AnthropicProviderConfig);
      case 'ollama':
        return new OllamaProvider(config as OllamaProviderConfig);
      case 'mock':
        return new MockProvider(config as MockProviderConfig);
      default:
        throw new Error(`不支持的 Provider 类型: ${(config as { type: string }).type}`);
    }
  }

  /** 支持的类型 */
  static supportedTypes(): ProviderType[] {
    return ['openai', 'moonshot', 'deepseek', 'minimax', 'anthropic', 'ollama', 'mock'];
  }
}
