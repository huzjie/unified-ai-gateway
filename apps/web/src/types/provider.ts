export type ProviderType = 'openai' | 'moonshot' | 'deepseek' | 'minimax' | 'anthropic' | 'ollama' | 'mock';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  baseUrl: string;
  apiKeyMasked?: string;
  hasApiKey?: boolean;
  models: string[];
  pricing: Record<string, unknown>;
  timeoutMs: number;
  maxRetries: number;
  enabled: 'enabled' | 'disabled';
  healthStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderCreateInput {
  name: string;
  type: ProviderType;
  baseUrl: string;
  apiKey?: string;
  models?: string[];
  pricing?: Record<string, unknown>;
  timeoutMs?: number;
  maxRetries?: number;
  enabled?: 'enabled' | 'disabled';
}

export interface ProviderTestResult {
  ok: boolean;
  latencyMs: number;
  message: string;
  models: string[];
}
