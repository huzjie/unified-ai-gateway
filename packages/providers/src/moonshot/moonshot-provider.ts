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
import { MoonshotRequestBuilder } from './moonshot-request-builder';
import { MoonshotResponseParser } from './moonshot-response-parser';
import { MoonshotErrorMapper } from './moonshot-error-mapper';
import { MOONSHOT_MODELS } from './moonshot-models';
import { RetryHandler } from '../base/retry-handler';
import { TimeoutManager } from '../base/timeout-manager';
import { HeadersBuilder } from '../base/headers-builder';
import { AuthBuilder } from '../base/auth-builder';
import { SseParser } from '../base/sse-parser';
import { StreamTransformer } from '../base/stream-transformer';

export interface MoonshotProviderConfig {
  name: string;
  baseUrl: string;
  apiKey: string | null;
  models?: string[];
  timeoutMs?: number;
  maxRetries?: number;
}

/**
 * Kimi / Moonshot 适配器
 * Moonshot API 与 OpenAI 兼容，直通即可，仅模型清单与价格不同。
 */
export class MoonshotProvider extends ProviderAdapterBase {
  readonly type = 'moonshot' as const;
  readonly name: string;
  private readonly baseUrl: string;
  private readonly apiKey: string | null;
  private readonly models: string[];
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  private readonly http = new HttpClient();
  private readonly requestBuilder = new MoonshotRequestBuilder();
  private readonly responseParser = new MoonshotResponseParser();
  private readonly errorMapper = new MoonshotErrorMapper();
  private readonly retryHandler = new RetryHandler();
  private readonly timeoutManager = new TimeoutManager();
  private readonly sseParser = new SseParser();
  private readonly streamTransformer = new StreamTransformer();

  constructor(config: MoonshotProviderConfig) {
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
    const ids = this.models.length > 0 ? this.models : Object.keys(MOONSHOT_MODELS);
    return ids.map((id) => ({
      id,
      provider: this.name,
      name: id,
      capabilities: { chat: true, streaming: true, functionCalling: true, contextWindow: 128000 },
      pricing: MOONSHOT_MODELS[id],
    }));
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
