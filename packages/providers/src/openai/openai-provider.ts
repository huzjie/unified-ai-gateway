import type {
  CallOptions,
  HealthStatus,
  ProviderChatParams,
  ProviderChatResult,
  ProviderModel,
  ProviderStreamEvent,
} from '@uag/types';
import { ProviderAdapterBase } from '../base/provider-adapter';
import { HttpClient } from '../base/http-client';
import { OpenAiRequestBuilder } from './openai-request-builder';
import { OpenAiResponseParser } from './openai-response-parser';
import { OpenAiErrorMapper } from './openai-error-mapper';
import { OPENAI_MODELS } from './openai-models';
import { RetryHandler } from '../base/retry-handler';
import { TimeoutManager } from '../base/timeout-manager';
import { HeadersBuilder } from '../base/headers-builder';
import { AuthBuilder } from '../base/auth-builder';
import { SseParser } from '../base/sse-parser';
import { StreamTransformer } from '../base/stream-transformer';

export interface OpenAiProviderConfig {
  name: string;
  baseUrl: string;
  apiKey: string | null;
  models?: string[];
  timeoutMs?: number;
  maxRetries?: number;
  /** 默认模型 */
  defaultModel?: string;
}

/**
 * OpenAI 适配器（直通）
 */
export class OpenAiProvider extends ProviderAdapterBase {
  readonly type = 'openai' as const;
  readonly name: string;
  private readonly baseUrl: string;
  private readonly apiKey: string | null;
  private readonly models: string[];
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  private readonly http = new HttpClient();
  private readonly requestBuilder = new OpenAiRequestBuilder();
  private readonly responseParser = new OpenAiResponseParser();
  private readonly errorMapper = new OpenAiErrorMapper();
  private readonly retryHandler = new RetryHandler();
  private readonly timeoutManager = new TimeoutManager();
  private readonly sseParser = new SseParser();
  private readonly streamTransformer = new StreamTransformer();

  constructor(config: OpenAiProviderConfig) {
    super();
    this.name = config.name;
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.models = config.models ?? [];
    this.timeoutMs = config.timeoutMs ?? 30000;
    this.maxRetries = config.maxRetries ?? 2;
  }

  async chat(params: ProviderChatParams, opts: CallOptions): Promise<ProviderChatResult> {
    const timeoutMs = this.timeoutManager.resolve(opts.timeoutMs || this.timeoutMs);
    const request = this.requestBuilder.build(this.baseUrl, '/chat/completions', this.apiKey, params, opts.headers);
    const response = await this.retryHandler.execute(
      async () => {
        const res = await this.http.request({ ...request, timeoutMs, signal: opts.signal });
        if (!res.ok) {
          throw this.errorMapper.map(res.status, this.safeParse(res.body));
        }
        return res;
      },
      this.maxRetries,
    );
    return this.responseParser.parse(this.safeParse(response.body), this.name, params.model);
  }

  async *chatStream(params: ProviderChatParams, opts: CallOptions): AsyncIterable<ProviderStreamEvent> {
    const timeoutMs = this.timeoutManager.resolve(opts.timeoutMs || this.timeoutMs);
    const streamParams = { ...params, stream: true };
    const request = this.requestBuilder.build(this.baseUrl, '/chat/completions', this.apiKey, streamParams, {
      ...HeadersBuilder.acceptSse(),
      ...opts.headers,
    });
    const res = await this.http.request({ ...request, timeoutMs, signal: opts.signal });
    if (!res.ok) {
      throw this.errorMapper.map(res.status, this.safeParse(res.body));
    }
    const events = this.sseParser.parse(res.body);
    for (const event of events) {
      if (event.data === '[DONE]') {
        yield { type: 'done' };
        continue;
      }
      const chunk = this.streamTransformer.transform(this.safeParse(event.data), {
        id: `chatcmpl-${Date.now()}`,
        model: params.model,
      });
      yield { type: 'chunk', chunk };
      opts.onStreamEvent?.({ type: 'chunk', chunk });
    }
    yield { type: 'done' };
  }

  async listModels(): Promise<ProviderModel[]> {
    if (this.models.length > 0) {
      return this.models.map((m) => ({
        id: m,
        provider: this.name,
        name: m,
        capabilities: { chat: true, streaming: true, functionCalling: true },
        pricing: OPENAI_MODELS[m],
      }));
    }
    return OPENAI_MODELS_ENTRIES(this.name);
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      if (this.apiKey) {
        const res = await this.http.get(
          `${this.baseUrl.replace(/\/$/, '')}/models`,
          HeadersBuilder.merge(HeadersBuilder.json(), AuthBuilder.bearer(this.apiKey)),
          5000,
        );
        return res.ok ? 'healthy' : 'unhealthy';
      }
      return 'unknown';
    } catch {
      return 'unhealthy';
    }
  }

  private safeParse(body: string): unknown {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
}

function OPENAI_MODELS_ENTRIES(provider: string): ProviderModel[] {
  return Object.entries(OPENAI_MODELS).map(([id, pricing]) => ({
    id,
    provider,
    name: id,
    capabilities: { chat: true, streaming: true, functionCalling: true },
    pricing,
  }));
}

// re-export helpers used internally
export { OPENAI_MODELS };