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
import { AnthropicRequestBuilder } from './anthropic-request-builder';
import { AnthropicResponseParser } from './anthropic-response-parser';
import { AnthropicSseTransformer } from './anthropic-sse-transformer';
import { AnthropicErrorMapper } from './anthropic-error-mapper';
import { ANTHROPIC_MODELS } from './anthropic-models';
import { RetryHandler } from '../base/retry-handler';
import { TimeoutManager } from '../base/timeout-manager';
import { AuthBuilder } from '../base/auth-builder';
import { SseParser } from '../base/sse-parser';

export interface AnthropicProviderConfig {
  name: string;
  baseUrl: string;
  apiKey: string | null;
  models?: string[];
  timeoutMs?: number;
  maxRetries?: number;
  apiVersion?: string;
}

/**
 * Anthropic 适配器（messages API）
 * 需要 OpenAI → Anthropic 协议转换。
 */
export class AnthropicProvider extends ProviderAdapterBase {
  readonly type = 'anthropic' as const;
  readonly name: string;
  private readonly baseUrl: string;
  private readonly apiKey: string | null;
  private readonly models: string[];
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly apiVersion: string;

  private readonly http = new HttpClient();
  private readonly requestBuilder = new AnthropicRequestBuilder();
  private readonly responseParser = new AnthropicResponseParser();
  private readonly sseTransformer = new AnthropicSseTransformer();
  private readonly errorMapper = new AnthropicErrorMapper();
  private readonly retryHandler = new RetryHandler();
  private readonly timeoutManager = new TimeoutManager();
  private readonly sseParser = new SseParser();

  constructor(config: AnthropicProviderConfig) {
    super();
    this.name = config.name;
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.models = config.models ?? [];
    this.timeoutMs = config.timeoutMs ?? 30000;
    this.maxRetries = config.maxRetries ?? 2;
    this.apiVersion = config.apiVersion ?? '2023-06-01';
  }

  async chat(params: ProviderChatParams, opts: CallOptions): Promise<ProviderChatResult> {
    const timeoutMs = this.timeoutManager.resolve(opts.timeoutMs || this.timeoutMs);
    const body = this.requestBuilder.buildBody(params);
    const headers = this.buildHeaders(opts.headers);
    const url = `${this.baseUrl.replace(/\/$/, '')}/v1/messages`;
    const response = await this.retryHandler.execute(
      async () => {
        const res = await this.http.request({ url, method: 'POST', headers, body, timeoutMs, signal: opts.signal });
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
    const body = this.requestBuilder.buildBody({ ...params, stream: true });
    const headers = this.buildHeaders({ ...opts.headers, accept: 'text/event-stream' });
    const url = `${this.baseUrl.replace(/\/$/, '')}/v1/messages`;
    const res = await this.http.request({ url, method: 'POST', headers, body, timeoutMs, signal: opts.signal });
    if (!res.ok) {
      throw this.errorMapper.map(res.status, this.safeParse(res.body));
    }
    const events = this.sseParser.parse(res.body);
    for (const event of events) {
      const transformed = this.sseTransformer.transformEvent(event, params.model);
      if (transformed) {
        yield transformed;
        if (transformed.type === 'chunk') {
          opts.onStreamEvent?.(transformed);
        }
      }
    }
  }

  async listModels(): Promise<ProviderModel[]> {
    const ids = this.models.length > 0 ? this.models : Object.keys(ANTHROPIC_MODELS);
    return ids.map((id) => ({
      id,
      provider: this.name,
      name: id,
      capabilities: { chat: true, streaming: true, vision: true, contextWindow: 200000 },
      pricing: ANTHROPIC_MODELS[id],
    }));
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      if (this.apiKey) {
        const res = await this.http.request({
          url: `${this.baseUrl.replace(/\/$/, '')}/v1/messages/count_tokens`,
          method: 'POST',
          headers: this.buildHeaders({}),
          body: { model: 'claude-3-5-sonnet', messages: [{ role: 'user', content: 'hi' }] },
          timeoutMs: 5000,
        });
        return res.ok || res.status === 400 ? 'healthy' : 'unhealthy';
      }
      return 'unknown';
    } catch {
      return 'unhealthy';
    }
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const base = {
      'content-type': 'application/json',
      ...(this.apiKey ? AuthBuilder.anthropic(this.apiKey, this.apiVersion) : {}),
      ...(extra ?? {}),
    };
    return base;
  }

  private safeParse(body: string): unknown {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
}
