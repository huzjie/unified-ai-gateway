import type { RequestContext, RouteDecision } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';
import { AppError, ErrorCode } from '@uag/core';
import { ChatService } from './chat-service';

/**
 * SSE 流式编排
 */
export class StreamingService {
  constructor(private readonly runtime: RuntimeRegistry, private readonly chatService: ChatService) {}

  /** 处理流式请求，返回 SSE 文本帧迭代器 */
  async *handleStream(ctx: RequestContext): AsyncIterable<string> {
    const decision = this.chatService.resolveWithFailover(ctx);
    ctx.routeDecision = decision;

    const { providerKey, stream } = await this.callProviderStream(ctx, decision);

    let promptTokens = 0;
    let completionTokens = 0;
    const startedAt = Date.now();

    try {
      for await (const frame of stream) {
        if (frame.type === 'chunk') {
          yield `data: ${JSON.stringify(frame.chunk)}\n\n`;
        } else if (frame.type === 'done') {
          if (frame.usage) {
            promptTokens = frame.usage.promptTokens;
            completionTokens = frame.usage.completionTokens;
          }
        } else if (frame.type === 'error') {
          this.runtime.breaker.recordFailure(providerKey, frame.error);
          throw frame.error;
        }
      }
      yield 'data: [DONE]\n\n';
      this.runtime.breaker.recordSuccess(providerKey);

      // 记录用量
      const usage = { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens };
      const cost = this.runtime.costCalculator.calculate(usage, decision.model);
      ctx.usage = usage;
      ctx.cost = cost;
      this.runtime.logService.recordLog({
        requestId: ctx.requestId,
        keyId: ctx.apiKey?.id ?? null,
        tenant: ctx.tenant,
        model: ctx.virtualModel,
        provider: providerKey,
        providerModel: decision.model,
        statusCode: 200,
        latencyMs: Date.now() - startedAt,
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        costAmount: cost.micro,
        currency: 'CNY',
        stream: true,
        cacheHit: false,
        errorCode: null,
        errorMessage: null,
      });
      // 缓存写入（若启用）
      if (this.runtime.settings.get().cacheEnabled) {
        const cacheKey = (ctx as RequestContext & { uagCacheKey?: string }).uagCacheKey;
        if (cacheKey) {
          this.runtime.repos.contextCache.set({
            cacheKey,
            model: decision.model,
            response: { id: `chatcmpl-${Date.now()}`, object: 'chat.completion', model: decision.model },
            promptTokens,
            completionTokens,
            ttlMs: 3600_000,
          });
        }
      }
    } catch (err) {
      this.runtime.eventBus.publish(
        'provider_failed',
        { providerKey, model: decision.model, errorCode: 'UAG-4004', errorMessage: err instanceof Error ? err.message : String(err), retryable: true },
        ctx.requestId,
      );
      throw new AppError(ErrorCode.UPSTREAM_TIMEOUT, '流式请求失败');
    }
  }

  /** 调用 Provider 流式接口 */
  private async callProviderStream(
    ctx: RequestContext,
    initial: RouteDecision,
  ): Promise<{ providerKey: string; stream: AsyncIterable<import('@uag/types').ProviderStreamEvent> }> {
    let decision = initial;
    for (let i = 0; i <= (initial.candidates?.length ?? 0) + 1; i++) {
      const providerKey = decision.provider;
      const breakerDecision = this.runtime.breaker.allow(providerKey);
      if (!breakerDecision.allowed) {
        const next = this.runtime.router.nextCandidate(decision, 'circuit_open');
        if (!next) throw new AppError(ErrorCode.ALL_PROVIDERS_FAILED, '流式：全部候选熔断');
        decision = next;
        continue;
      }
      const adapter = this.runtime.providers.get(providerKey);
      if (!adapter) {
        const next = this.runtime.router.nextCandidate(decision, 'provider_unavailable');
        if (!next) throw new AppError(ErrorCode.ALL_PROVIDERS_FAILED, '流式：Provider 不存在');
        decision = next;
        continue;
      }
      try {
        const stream = adapter.chatStream(
          {
            model: decision.model,
            messages: ctx.payload.messages,
            temperature: ctx.payload.temperature,
            maxTokens: ctx.payload.max_tokens,
            stream: true,
          },
          {
            timeoutMs: this.runtime.settings.get().defaultTimeoutMs,
            maxRetries: 0,
            headers: { 'x-uag-request-id': ctx.requestId },
          },
        );
        return { providerKey, stream };
      } catch (err) {
        this.runtime.breaker.recordFailure(providerKey, err instanceof Error ? err : new Error(String(err)));
        const next = this.runtime.router.nextCandidate(decision, 'upstream_error');
        if (!next) throw new AppError(ErrorCode.ALL_PROVIDERS_FAILED, '流式：全部候选失败');
        decision = next;
      }
    }
    throw new AppError(ErrorCode.ALL_PROVIDERS_FAILED, '流式：无可用 Provider');
  }
}
