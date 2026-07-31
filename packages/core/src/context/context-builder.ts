import type { ApiKeyEntity, ChatRequest } from '@uag/types';
import { RequestContextImpl } from './request-context';

/**
 * 上下文构建器：从 HTTP/管理操作构建请求上下文
 */
export interface BuildContextInput {
  apiKey?: ApiKeyEntity | null;
  tenant?: string;
  ip?: string;
  virtualModel: string;
  payload: ChatRequest;
  headers?: Record<string, string>;
  requestId?: string;
}

export class RequestContextBuilder {
  /** 从原始输入构建上下文 */
  build(input: BuildContextInput): RequestContextImpl {
    return new RequestContextImpl({
      apiKey: input.apiKey,
      tenant: input.tenant,
      ip: input.ip,
      virtualModel: input.virtualModel,
      payload: input.payload,
      headers: input.headers,
      requestId: input.requestId,
    });
  }

  /** 便捷：从 Fastify 风格请求构建 */
  buildFromHttp(input: {
    apiKey?: ApiKeyEntity | null;
    ip?: string;
    body: ChatRequest;
    headers?: Record<string, string>;
    requestId?: string;
  }): RequestContextImpl {
    const body = input.body ?? ({} as ChatRequest);
    return this.build({
      apiKey: input.apiKey,
      ip: input.ip,
      virtualModel: body.model ?? '',
      payload: body,
      headers: input.headers,
      requestId: input.requestId,
    });
  }
}
