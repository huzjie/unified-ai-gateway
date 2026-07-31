import type { ProviderChatParams } from '@uag/types';

/**
 * OpenAI → Anthropic 协议转换
 * messages API：model / messages / max_tokens / system / temperature / top_p / stream
 */
export class AnthropicRequestBuilder {
  /** 构建 Anthropic messages API 请求体 */
  buildBody(params: ProviderChatParams): Record<string, unknown> {
    const { system, messages } = this.splitSystem(params.messages);
    const body: Record<string, unknown> = {
      model: params.model,
      messages,
      max_tokens: params.maxTokens ?? 4096,
    };
    if (system) {
      body.system = system;
    }
    if (params.temperature !== undefined) {
      body.temperature = params.temperature;
    }
    if (params.topP !== undefined) {
      body.top_p = params.topP;
    }
    if (params.stop && params.stop.length > 0) {
      body.stop_sequences = params.stop;
    }
    if (params.stream !== undefined) {
      body.stream = params.stream;
    }
    return body;
  }

  /** 拆分 system 消息与普通消息 */
  private splitSystem(messages: ProviderChatParams['messages']): {
    system?: string;
    messages: Array<{ role: string; content: string }>;
  } {
    const systemParts: string[] = [];
    const rest: Array<{ role: string; content: string }> = [];
    for (const msg of messages) {
      const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
      if (msg.role === 'system') {
        systemParts.push(content);
      } else {
        rest.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content });
      }
    }
    return {
      system: systemParts.length > 0 ? systemParts.join('\n') : undefined,
      messages: rest,
    };
  }
}
