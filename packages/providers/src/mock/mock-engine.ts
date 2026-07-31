import type { ProviderChatParams, ProviderChatResult } from '@uag/types';
import { AppError, ErrorCode } from '@uag/core';

/** Mock 引擎选项 */
export interface MockEngineOptions {
  /** 模拟延迟（ms） */
  delayMs?: number;
  /** 故障注入比例（0~1） */
  failureRate?: number;
  /** 故障注入错误码 */
  failureCode?: ErrorCode;
  /** 是否回显请求（默认 true） */
  echo?: boolean;
  /** 固定响应文本（覆盖 echo） */
  fixedResponse?: string;
  /** 响应中的 provider 名（默认 'mock'，通常由 Provider 配置名注入） */
  providerName?: string;
}

/**
 * 确定性响应引擎（echo/延迟/故障注入）
 */
export class MockEngine {
  private readonly options: Required<MockEngineOptions>;

  constructor(options: MockEngineOptions = {}) {
    this.options = {
      delayMs: options.delayMs ?? 0,
      failureRate: options.failureRate ?? 0,
      failureCode: options.failureCode ?? ErrorCode.PROVIDER_UNAVAILABLE,
      echo: options.echo ?? true,
      fixedResponse: options.fixedResponse ?? '',
      providerName: options.providerName ?? 'mock',
    };
  }

  /** 是否应触发故障 */
  shouldFail(): boolean {
    if (this.options.failureRate <= 0) {
      return false;
    }
    return Math.random() < this.options.failureRate;
  }

  /** 构造故障错误 */
  buildFailure(model: string): AppError {
    return new AppError(this.options.failureCode, `mock provider 故障注入 (model=${model})`);
  }

  /** 模拟延迟 */
  async delay(): Promise<void> {
    if (this.options.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.options.delayMs));
    }
  }

  /** 生成确定性响应 */
  generateResponse(params: ProviderChatParams): ProviderChatResult {
    const lastUser = [...params.messages].reverse().find((m) => m.role === 'user');
    const content =
      this.options.fixedResponse ||
      (this.options.echo && lastUser
        ? `[mock:${params.model}] ${typeof lastUser.content === 'string' ? lastUser.content : JSON.stringify(lastUser.content)}`
        : `[mock:${params.model}] hello from mock provider`);

    const promptTokens = this.countTokens(params.messages);
    const completionTokens = this.countChars(content);
    return {
      id: `mockcmpl-${Date.now()}`,
      model: params.model,
      provider: this.options.providerName,
      content,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      finishReason: 'stop',
      createdAt: new Date().toISOString(),
    };
  }

  private countTokens(messages: ProviderChatParams['messages']): number {
    let total = 0;
    for (const m of messages) {
      const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
      total += Math.ceil(content.length / 4);
    }
    return Math.max(1, total);
  }

  private countChars(text: string): number {
    return Math.max(1, Math.ceil(text.length / 4));
  }
}
