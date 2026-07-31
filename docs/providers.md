# Provider 接入总指南

统一 AI 网关通过 `ProviderAdapter` 接口对接各家 LLM Provider。新增一个 Provider 需要：

## 1. 实现适配器

在 `packages/providers/src/<name>/` 下实现：

```
<name>-provider.ts           # 适配器主体（继承 ProviderAdapterBase）
<name>-request-builder.ts    # OpenAI 兼容请求 → 上游请求
<name>-response-parser.ts    # 上游响应 → 归一化响应
<name>-sse-transformer.ts    # 上游 SSE → OpenAI 兼容 SSE
<name>-error-mapper.ts       # 上游错误 → AppError（retryable 标记）
<name>-models.ts             # 默认模型清单与计价
```

## 2. 注册

- 在 `ProviderFactory` 的 switch 中注册类型
- 在 `packages/types` 的 `ProviderType` 枚举中补充类型
- 在 `ProviderConfigMapper` 确认配置映射

## 3. 测试

在 `tests/<name>-provider.test.ts` 中补充单元测试。

## 关键点

- 协议转换必须处理：鉴权头、消息格式、流式格式、错误格式
- 错误必须映射为 `AppError` 并标记 `retryable`（5xx/429/网络错误可重试）
- 金额单位统一：CNY / 1K tokens
