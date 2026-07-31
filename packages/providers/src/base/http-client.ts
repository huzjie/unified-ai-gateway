import { request as undiciRequest } from 'undici';

/** HTTP 响应包装 */
export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
  ok: boolean;
}

export interface HttpRequestOptions {
  url: string;
  /** 默认 POST */
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs: number;
  signal?: AbortSignal;
}

/** undici 请求响应最小接口（规避版本类型差异） */
interface UndiciResponseLike {
  status: number;
  ok: boolean;
  headers: { forEach: (cb: (value: string, key: string) => void) => void };
  text: () => Promise<string>;
}

/**
 * undici HTTP 客户端（超时/重定向/代理）
 */
export class HttpClient {
  /** 发送 JSON 请求 */
  async request(options: HttpRequestOptions): Promise<HttpResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs);
    const signal = options.signal
      ? AbortSignal.any([controller.signal, options.signal])
      : controller.signal;

    try {
      const init = {
        method: options.method ?? 'POST',
        headers: options.headers as Record<string, string>,
        signal,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      };
      const res = (await undiciRequest(options.url, init as never)) as unknown as UndiciResponseLike;
      const bodyText = await res.text();
      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });
      return {
        status: res.status,
        headers,
        body: bodyText,
        ok: res.ok,
      };
    } finally {
      clearTimeout(timer);
    }
  }

  /** GET 请求 */
  async get(url: string, headers: Record<string, string>, timeoutMs: number): Promise<HttpResponse> {
    return this.request({ url, method: 'GET', headers, timeoutMs });
  }

  /** POST JSON 请求 */
  async post(url: string, headers: Record<string, string>, body: unknown, timeoutMs: number): Promise<HttpResponse> {
    return this.request({ url, method: 'POST', headers, body, timeoutMs });
  }
}
