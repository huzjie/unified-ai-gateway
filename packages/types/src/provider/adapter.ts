import type { HealthStatus, ProviderType } from '../common/status';
import type { ISODateTime } from '../common/timestamp';
import type { ProviderModel } from './model';
import type { ProviderChatParams, ProviderChatResult, ProviderStreamEvent } from './request';
import type { OpenAICompatibleChatResponse } from '../gateway/chat-response';

/** 调用选项 */
export interface CallOptions {
  /** 请求超时（连接 + 响应），ms */
  timeoutMs: number;
  /** 重试次数（仅幂等请求），默认 0 */
  maxRetries: number;
  signal?: AbortSignal;
  /** 附加头（透传/覆盖） */
  headers?: Record<string, string>;
  /** 流式聚合钩子 */
  onStreamEvent?: (evt: ProviderStreamEvent) => void;
}

/**
 * Provider 适配器接口（所有 Provider 的统一契约）
 */
export interface ProviderAdapter {
  /** Provider 类型 */
  readonly type: ProviderType;
  /** 配置名（如 'moonshot-prod'） */
  readonly name: string;

  /** 非流式对话：归一化请求 → 归一化响应 */
  chat(params: ProviderChatParams, opts: CallOptions): Promise<ProviderChatResult>;

  /** 流式对话：归一化请求 → OpenAI 兼容 SSE 事件流 */
  chatStream(params: ProviderChatParams, opts: CallOptions): AsyncIterable<ProviderStreamEvent>;

  /** 返回该 Provider 支持的模型清单（含计价信息） */
  listModels(): Promise<ProviderModel[]>;

  /** 连通性/鉴权健康检查 */
  healthCheck(): Promise<HealthStatus>;

  /** 将上游原生响应转换为 OpenAI 兼容响应（缺省由基类完成） */
  toOpenAICompatible?(result: ProviderChatResult): OpenAICompatibleChatResponse;

  /** 获取 Provider 配置名（与 name 一致） */
  getProviderName?(): string;

  createdAt?: ISODateTime;
}
