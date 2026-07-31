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
import { OllamaRequestBuilder } from './ollama-request-builder';
import { OllamaResponseParser } from './ollama-response-parser';
import { OllamaSseTransformer } from './ollama-sse-transformer';
import { OllamaErrorMapper } from './ollama-error-mapper';
import { OLLAMA_MODELS } from './ollama-models';
import { TimeoutManager } from '../base/timeout-manager';

export interface OllamaProviderConfig {
  name: string;
  baseUrl: string;
  apiKey?: string | null;
  models?: string[];
  timeoutMs?: number;
  maxRetries?: number;
}

/**
 * Ollama 本地适配器（/api/chat）
 * 无需鉴权；响应格式为 { message: { content }, done }。
 */
export class OllamaProvider extends ProviderAdapterBase {
  readonly type = 'ollama' as const;
  readonly name: string;
  private readonly baseUrl: string;
  private readonly models: string[];
  private readonly timeoutMs: number;

  private readonly http = new HttpClient();
  private readonly requestBuilder = new OllamaRequestBuilder();
  private readonly responseParser = new OllamaResponseParser();
  private readonly sseTransformer = new OllamaSseTransformer();
  private readonly errorMapper = new OllamaErrorMapper();
  private readonly timeoutManager = new TimeoutManager();

  constructor(config: OllamaProviderConfig) {
    super();
    this.name = config.name;
    this.baseUrl = config.baseUrl;
    this.models = config.models ?? [];
    this.timeoutMs = config.timeoutMs ?? 30000;
  }

  async chat(params: ProviderChatParams, opts: CallOptions): Promise<ProviderChatResult> {
    const timeoutMs = this.timeoutManager.resolve(opts.timeoutMs || this.timeoutMs);
    const body = this.requestBuilder.buildBody(params);
    const url = `${this.baseUrl.replace(/\/$/, '')}/api/chat`;
    const res = await this.http.request({
      url,
      method: 'POST',
      headers: { 'content-type': 'application/json', ...opts.headers },
      body,
      timeoutMs,
      signal: opts.signal,
    });
    if (!res.ok) {
      throw this.errorMapper.map(res.status, this.safeParse(res.body));
    }
    return this.responseParser.parse(this.safeParse(res.body), this.name, params.model);
  }

  async *chatStream(params: ProviderChatParams, opts: CallOptions): AsyncIterable<ProviderStreamEvent> {
    const timeoutMs = this.timeoutManager.resolve(opts.timeoutMs || this.timeoutMs);
    const body = this.requestBuilder.buildBody({ ...params, stream: true });
    const url = `${this.baseUrl.replace(/\/$/, '')}/api/chat`;
    const res = await this.http.request({
      url,
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/x-ndjson', ...opts.headers },
      body,
      timeoutMs,
      signal: opts.signal,
    });
    if (!res.ok) {
      throw this.errorMapper.map(res.status, this.safeParse(res.body));
    }
    // Ollama 流式返回 NDJSON（每行一个 JSON）
    const lines = res.body.split(/\r?\n/).filter((l) => l.trim());
    for (const line of lines) {
      const parsed = this.safeParse(line);
      const transformed = this.sseTransformer.transformNdjson(parsed, params.model);
      if (transformed) {
        yield transformed;
        if (transformed.type === 'chunk') {
          opts.onStreamEvent?.(transformed);
        }
      }
    }
  }

  async listModels(): Promise<ProviderModel[]> {
    const ids = this.models.length > 0 ? this.models : Object.keys(OLLAMA_MODELS);
    return ids.map((id) => ({
      id,
      provider: this.name,
      name: id,
      capabilities: { chat: true, streaming: true },
      pricing: OLLAMA_MODELS[id],
    }));
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      const res = await this.http.get(`${this.baseUrl.replace(/\/$/, '')}/api/tags`, {}, 5000);
      return res.ok ? 'healthy' : 'unhealthy';
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
