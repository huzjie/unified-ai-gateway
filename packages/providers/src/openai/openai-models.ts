import type { ProviderModel } from '@uag/types';

/**
 * OpenAI 默认模型清单与计价（CNY / 1K tokens）
 * 价格仅为估算参考，实际以官方计价为准；可在 Provider 配置中覆盖。
 */
export const OPENAI_MODELS: Record<string, { input: number; output: number; perRequest?: number }> = {
  'gpt-4o': { input: 17.5, output: 70 },
  'gpt-4o-mini': { input: 1.1, output: 4.4 },
  'gpt-4-turbo': { input: 70, output: 210 },
  'gpt-3.5-turbo': { input: 3.5, output: 10.5 },
  'gpt-5.6': { input: 70, output: 280 },
};

/** 默认模型清单 */
export function openaiDefaultModels(provider: string): ProviderModel[] {
  return Object.entries(OPENAI_MODELS).map(([id, pricing]) => ({
    id,
    provider,
    name: id,
    capabilities: { chat: true, streaming: true, functionCalling: true, contextWindow: 128000 },
    pricing,
  }));
}
