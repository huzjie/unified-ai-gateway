export interface UsageLog {
  id: string;
  requestId: string;
  keyId: string | null;
  tenant: string;
  model: string;
  provider: string;
  providerModel: string;
  statusCode: number;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costAmount: number;
  currency: string;
  stream: boolean;
  cacheHit: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface LogFilter {
  keyId?: string;
  tenant?: string;
  model?: string;
  provider?: string;
  statusCode?: number;
  search?: string;
  startTime?: string;
  endTime?: string;
}
