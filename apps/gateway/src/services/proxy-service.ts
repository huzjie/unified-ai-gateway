import type { HttpClient } from '@uag/providers';

/**
 * 上游 HTTP 代理（透传头/体）
 */
export class ProxyService {
  constructor(private readonly http: HttpClient) {}

  /** 透传转发 */
  async proxy(options: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: unknown;
    timeoutMs: number;
  }): Promise<{ status: number; headers: Record<string, string>; body: string }> {
    const res = await this.http.request({
      url: options.url,
      method: options.method,
      headers: options.headers,
      body: options.body,
      timeoutMs: options.timeoutMs,
    });
    return { status: res.status, headers: res.headers, body: res.body };
  }
}
