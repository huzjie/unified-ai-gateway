import type {
  CallOptions,
  HealthStatus,
  ProviderChatParams,
  ProviderChatResult,
  ProviderModel,
  ProviderStreamEvent,
} from '@uag/types';
import { ProviderAdapterBase } from '../base/provider-adapter';
import { MockEngine, type MockEngineOptions } from './mock-engine';
import { mockModels } from './mock-data';
import { createMockSseStream } from './mock-sse';

export interface MockProviderConfig {
  name: string;
  models?: string[];
  options?: MockEngineOptions;
}

/**
 * Mock Provider（内存假 Provider，测试/演示）
 * 确定性响应引擎：echo / 延迟 / 故障注入，真实逻辑。
 */
export class MockProvider extends ProviderAdapterBase {
  readonly type = 'mock' as const;
  readonly name: string;
  private readonly engine: MockEngine;
  private readonly models: string[];

  constructor(config: MockProviderConfig) {
    super();
    this.name = config.name;
    // provider 名以 Provider 配置为准（覆盖 options 中的默认 'mock'）
    this.engine = new MockEngine({ ...(config.options ?? {}), providerName: config.name });
    this.models = config.models ?? Object.keys(mockModels);
  }

  async chat(params: ProviderChatParams, _opts: CallOptions): Promise<ProviderChatResult> {
    // 故障注入
    if (this.engine.shouldFail()) {
      throw this.engine.buildFailure(params.model);
    }
    await this.engine.delay();
    return this.engine.generateResponse(params);
  }

  async *chatStream(params: ProviderChatParams, opts: CallOptions): AsyncIterable<ProviderStreamEvent> {
    if (this.engine.shouldFail()) {
      throw this.engine.buildFailure(params.model);
    }
    await this.engine.delay();
    for await (const event of createMockSseStream(this.engine.generateResponse(params), params.model)) {
      yield event;
      if (event.type === 'chunk') {
        opts.onStreamEvent?.(event);
      }
    }
  }

  async listModels(): Promise<ProviderModel[]> {
    return this.models.map((id) => ({
      id,
      provider: this.name,
      name: id,
      capabilities: { chat: true, streaming: true },
      pricing: mockModels[id],
    }));
  }

  async healthCheck(): Promise<HealthStatus> {
    return 'healthy';
  }
}
