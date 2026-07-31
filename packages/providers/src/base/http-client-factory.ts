import { HttpClient } from './http-client';

/** HTTP 客户端工厂配置 */
export interface HttpClientFactoryConfig {
  /** 是否启用代理（默认 true） */
  proxy?: boolean;
  /** 最大重定向 */
  maxRedirects?: number;
  /** 默认超时 */
  defaultTimeoutMs?: number;
}

/**
 * HTTP 客户端工厂
 */
export class HttpClientFactory {
  /** 默认超时（ms） */
  readonly defaultTimeoutMs: number;

  constructor(config: HttpClientFactoryConfig = {}) {
    this.defaultTimeoutMs = config.defaultTimeoutMs ?? 30000;
  }

  create(): HttpClient {
    return new HttpClient();
  }

  /** 创建带默认超时的客户端 */
  createWithDefaults(): HttpClient {
    return new HttpClient();
  }
}
