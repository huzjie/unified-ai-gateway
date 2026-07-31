import type { ApiKeyEntity, ChatRequest, CostAmount, RequestContext, RouteDecision, Usage } from '@uag/types';
import { EMPTY_USAGE } from '@uag/types';
import { generateCorrelationId } from './correlation-id';

/**
 * 请求上下文实现
 */
export class RequestContextImpl implements RequestContext {
  requestId: string;
  apiKey: ApiKeyEntity | null;
  tenant: string;
  ip: string;
  virtualModel: string;
  payload: ChatRequest;
  routeDecision: RouteDecision | null = null;
  usage: Usage = { ...EMPTY_USAGE };
  cost: CostAmount | null = null;
  stream: boolean;
  headers: Record<string, string>;
  startedAt: number;

  constructor(input: {
    requestId?: string;
    apiKey?: ApiKeyEntity | null;
    tenant?: string;
    ip?: string;
    virtualModel: string;
    payload: ChatRequest;
    stream?: boolean;
    headers?: Record<string, string>;
  }) {
    this.requestId = input.requestId ?? generateCorrelationId();
    this.apiKey = input.apiKey ?? null;
    this.tenant = input.tenant ?? this.apiKey?.tenant ?? 'anonymous';
    this.ip = input.ip ?? '';
    this.virtualModel = input.virtualModel;
    this.payload = input.payload;
    this.stream = input.stream ?? Boolean(input.payload.stream);
    this.headers = input.headers ?? {};
    this.startedAt = Date.now();
  }
}
