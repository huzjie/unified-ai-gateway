# 架构

Unified AI Gateway 采用**分层 + 插件化（Layered + Plugin）**架构。

## 分层

| 层 | 目录 | 职责 |
|---|---|---|
| 接入层 | apps/gateway | Fastify HTTP 服务：协议适配、鉴权、限流拦截、管理 API |
| 核心引擎层 | packages/core | 纯 TS 领域逻辑：路由/限流/熔断/成本/事件/错误 |
| 适配器层 | packages/providers | ProviderAdapter 接口 + 7 类适配器 |
| 存储层 | packages/storage | Repository 接口 + better-sqlite3 + 内存 fallback + 迁移 |
| 共享类型层 | packages/types | 全仓唯一类型来源 |
| 管理面 | apps/web + apps/cli | React 控制台 + 命令行工具 |

依赖方向严格单向：`web/cli → gateway → core + providers + storage`，`providers/storage/core → types`。

## 核心模块

- **路由引擎**：priority / failover / cost-first / random
- **限流器**：token-bucket / fixed-window / sliding-window / 并发限制
- **熔断器**：CLOSED / OPEN / HALF_OPEN 状态机 + 半开探测
- **成本计算**：配置文件单价 × token 用量，整数微元运算
- **事件总线**：进程内事件，listener 落库/推送

## 存储

better-sqlite3（WAL 模式），10+ 张表：providers / api_keys / route_rules / usage_logs / daily_stats / settings / audit_logs / context_cache / webhooks / quota_usage。
