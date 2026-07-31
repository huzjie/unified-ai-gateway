import type { ProviderChatParams } from '@uag/types';

/**
 * 请求体归一（参数默认值）
 */
export class BodyNormalizer {
  /** 归一化参数，填充默认值 */
  normalize(params: ProviderChatParams): ProviderChatParams {
    return {
      ...params,
      temperature: params.temperature ?? 1,
      topP: params.topP ?? 1,
      maxTokens: params.maxTokens ?? 4096,
      stop: params.stop ?? [],
      presencePenalty: params.presencePenalty ?? 0,
      frequencyPenalty: params.frequencyPenalty ?? 0,
    };
  }

  /** 校验最小必填字段 */
  validate(params: ProviderChatParams): void {
    if (!params.model) {
      throw new Error('model 不能为空');
    }
    if (!Array.isArray(params.messages) || params.messages.length === 0) {
      throw new Error('messages 不能为空');
    }
  }
}
