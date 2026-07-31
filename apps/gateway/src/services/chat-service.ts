import type { ProviderChatResult, RequestContext, RouteDecision } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';
import { AppError, ErrorCode } from '@uag/core';

/**
 * 主链路编排（鉴权后 → 限流 → 路由 → 代理 → 成本 → 日志）
 */
export class ChatService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 处理 chat 请求 */
  async handleChat(ctx: RequestContext): Promise<Record<string, unknown>> {
    // 1. 路由决策
    const decision = this.resolveWithFailover(ctx);
    ctx.routeDecision = decision;

    // 2. 调用 Provider（含熔断/故障转移）
    const { result, providerKey } = await this.callWithFailover(ctx, decision);
    // 反映实际使用（故障转移后）的 Provider，供响应头/审计使用
    ctx.routeDecision = { ...decision, provider: providerKey };

    // 3. 成本计算
    const usage = result.usage ?? { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    const cost = this.runtime.costCalculator.calculate(usage, result.model);
    ctx.usage = usage;
    ctx.cost = cost;

    // 4. 记录日志
    this.runtime.logService.recordLog({
      requestId: ctx.requestId,
      keyId: ctx.apiKey?.id ?? null,
      tenant: ctx.tenant,
      model: ctx.virtualModel,
      provider: providerKey,
      providerModel: result.model,
      statusCode: 200,
      latencyMs: Date.now() - ctx.startedAt,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
      costAmount: cost.micro,
      currency: 'CNY',
      stream: false,
      cacheHit: false,
      errorCode: null,
      errorMessage: null,
    });

    const adapter = this.runtime.providers.get(providerKey);
    if (!adapter || !adapter.toOpenAICompatible) {
      return result as unknown as Record<string, unknown>;
    }
    return adapter.toOpenAICompatible(result) as unknown as Record<string, unknown>;
  }

  /** 带故障转移的路由解析 */
  resolveWithFailover(ctx: RequestContext): RouteDecision {
    let decision = this.runtime.router.resolve(ctx);
    if (!decision.provider) {
      throw new AppError(ErrorCode.ALL_PROVIDERS_FAILED, '无可用 Provider 候选');
    }
    return decision;
  }

  /** 调用 Provider 并支持熔断故障转移 */
  async callWithFailover(
    ctx: RequestContext,
    initial: RouteDecision,
  ): Promise<{ result: ProviderChatResult; providerKey: string }> {
    let decision = initial;
    const chain: string[] = [];
    for (let i = 0; i <= (initial.candidates?.length ?? 0) + 1; i++) {
      const providerKey = decision.provider;
      chain.push(providerKey);

      // 熔断检查
      const breakerDecision = this.runtime.breaker.allow(providerKey);
      if (!breakerDecision.allowed) {
        this.runtime.eventBus.publish(
          'provider_failed',
          { providerKey, model: decision.model, errorCode: 'UAG-4003', errorMessage: 'circuit open', retryable: true },
          ctx.requestId,
        );
        const next = this.runtime.router.nextCandidate(decision, 'circuit_open');
        if (!next) {
          throw new AppError(ErrorCode.ALL_PROVIDERS_FAILED, `全部候选 Provider 失败: ${chain.join('->')}`);
        }
        decision = next;
        continue;
      }

      const adapter = this.runtime.providers.get(providerKey);
      if (!adapter) {
        const next = this.runtime.router.nextCandidate(decision, 'provider_unavailable');
        if (!next) {
          throw new AppError(ErrorCode.ALL_PROVIDERS_FAILED, `Provider ${providerKey} 不存在`);
        }
        decision = next;
        continue;
      }

      try {
        const result = await adapter.chat(
          {
            model: decision.model,
            messages: ctx.payload.messages,
            temperature: ctx.payload.temperature,
            topP: ctx.payload.top_p,
            maxTokens: ctx.payload.max_tokens,
            stop: typeof ctx.payload.stop === 'string' ? [ctx.payload.stop] : ctx.payload.stop,
            stream: false,
            presencePenalty: ctx.payload.presence_penalty,
            frequencyPenalty: ctx.payload.frequency_penalty,
            user: ctx.payload.user,
            tools: ctx.payload.tools,
            toolChoice: ctx.payload.tool_choice,
            extraBody: this.extractExtraBody(ctx.payload),
          },
          {
            timeoutMs: this.runtime.settings.get().defaultTimeoutMs,
            maxRetries: this.runtime.settings.get().defaultMaxRetries,
            headers: { 'x-uag-request-id': ctx.requestId },
          },
        );
        this.runtime.breaker.recordSuccess(providerKey);
        return { result, providerKey };
      } catch (err) {
        this.runtime.breaker.recordFailure(providerKey, err instanceof Error ? err : new Error(String(err)));
        const retryable = AppError.isAppError(err) ? err.retryable : true;
        this.runtime.eventBus.publish(
          'provider_failed',
          {
            providerKey,
            model: decision.model,
            errorCode: AppError.isAppError(err) ? err.code : 'UAG-9001',
            errorMessage: err instanceof Error ? err.message : String(err),
            retryable,
          },
          ctx.requestId,
        );
        const reason = AppError.isAppError(err) && err.code === ErrorCode.UPSTREAM_TIMEOUT ? 'upstream_timeout' : 'upstream_error';
        const next = this.runtime.router.nextCandidate(decision, reason);
        if (!next) {
          throw new AppError(ErrorCode.ALL_PROVIDERS_FAILED, `全部候选 Provider 失败: ${chain.join('->')}`);
        }
        decision = next;
      }
    }
    throw new AppError(ErrorCode.ALL_PROVIDERS_FAILED, `全部候选 Provider 失败: ${chain.join('->')}`);
  }

  /** 从 ChatRequest 提取透传字段 */
  private extractExtraBody(payload: Record<string, unknown>): Record<string, unknown> {
    const known = new Set([
      'model', 'messages', 'temperature', 'top_p', 'max_tokens', 'stop', 'stream',
      'presence_penalty', 'frequency_penalty', 'user', 'tools', 'tool_choice',
    ]);
    const extra: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (!known.has(key)) {
        extra[key] = value;
      }
    }
    return extra;
  }
}
