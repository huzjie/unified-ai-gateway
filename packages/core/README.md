# @uag/core

统一 AI 网关核心引擎，**纯 TypeScript 领域逻辑**，不依赖任何 HTTP/存储实现，可独立单测。

## 模块

- `errors/` — UAG-XXXX 错误码体系
- `routing/` — 路由引擎（priority/failover/cost-first/random）
- `alias/` — 模型别名/虚拟模型
- `context/` — 请求上下文与关联 ID
- `events/` — 进程内事件总线 + listeners
- `rate-limiter/` — token-bucket/fixed-window/sliding-window/并发
- `circuit-breaker/` — CLOSED/OPEN/HALF_OPEN 状态机
- `cost/` — 计价表/成本计算/Token 计数/聚合
- `config/` — 配置加载与校验
- `utils/` — 日志/时间/重试/退避/哈希/ID/流/JSON/数学工具

## 约定

- 金额运算用整数微元（1 元 = 1_000_000 微元）
- 时间戳 ISO 8601 UTC
