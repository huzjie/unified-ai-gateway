import type { ProviderChatParams } from '@uag/types';

/** 上游请求结果 */
export interface UpstreamRequest {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

/**
 * OpenAI 兼容请求 → 上游请求
 * 子类可覆盖 body 转换逻辑。
 */
export class RequestBuilder {
  /** 构建上游请求（默认直通 OpenAI 格式） */
  build(
    baseUrl: string,
    path: string,
    apiKey: string | null,
    params: ProviderChatParams,
    extraHeaders: Record<string, string> = {},
  ): UpstreamRequest {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      ...extraHeaders,
    };
    if (apiKey) {
      headers.authorization = `Bearer ${apiKey}`;
    }
    return {
      url: `${baseUrl.replace(/\/$/, '')}${path}`,
      headers,
      body: this.buildBody(params),
    };
  }

  /** 构建请求体（子类覆盖） */
  buildBody(params: ProviderChatParams): Record<string, unknown> {
    return {
      model: params.model,
      messages: params.messages,
      ...(params.temperature !== undefined ? { temperature: params.temperature } : {}),
      ...(params.topP !== undefined ? { top_p: params.topP } : {}),
      ...(params.maxTokens !== undefined ? { max_tokens: params.maxTokens } : {}),
      ...(params.stop !== undefined ? { stop: params.stop } : {}),
      ...(params.stream !== undefined ? { stream: params.stream } : {}),
      ...(params.presencePenalty !== undefined ? { presence_penalty: params.presencePenalty } : {}),
      ...(params.frequencyPenalty !== undefined ? { frequency_penalty: params.frequencyPenalty } : {}),
      ...(params.user !== undefined ? { user: params.user } : {}),
      ...(params.tools !== undefined ? { tools: params.tools } : {}),
      ...(params.toolChoice !== undefined ? { tool_choice: params.toolChoice } : {}),
      ...(params.extraBody ?? {}),
    };
  }
}
