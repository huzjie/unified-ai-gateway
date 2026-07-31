import type { ProviderChatParams } from '@uag/types';

/**
 * 模型名/参数归一
 */
export function normalizeModelName(model: string): string {
  return model
    .trim()
    .toLowerCase()
    // 下划线/非法字符统一转连字符（'kimi_k3!' → 'kimi-k3'）
    .replace(/[^a-z0-9.-]/g, '-')
    // 去除替换产生的首尾连字符
    .replace(/^-+|-+$/g, '');
}

/** 参数归一（填充默认值） */
export function normalizeParams(params: ProviderChatParams): ProviderChatParams {
  return {
    ...params,
    temperature: params.temperature ?? 1,
    topP: params.topP ?? 1,
    maxTokens: params.maxTokens ?? 4096,
    stop: params.stop ?? [],
  };
}
