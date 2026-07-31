import { auth } from './auth';
import { output } from './output';

export interface ApiResponse<T = Record<string, unknown>> {
  code: number | string;
  data: T;
  message: string;
}

/**
 * 管理 API 客户端
 */
class HttpClient {
  private baseUrl = process.env.GATEWAY_CLI_API_URL ?? 'http://localhost:8787';

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  private async request<T>(method: string, path: string, body?: unknown, raw = false): Promise<T> {
    const token = auth.getToken();
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok && !raw) {
      const errBody = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
      output.error(errBody?.error?.message ?? `HTTP ${res.status}`);
      throw new Error(`API 请求失败: ${res.status}`);
    }
    if (raw) {
      return (await res.text()) as T;
    }
    return (await res.json()) as T;
  }

  get<T = ApiResponse>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  getRaw(path: string): Promise<string> {
    return this.request<string>('GET', path, undefined, true);
  }

  post<T = ApiResponse>(path: string, body: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  put<T = ApiResponse>(path: string, body: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  delete<T = ApiResponse>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

export const httpClient = new HttpClient();
