# 测试策略

## 分层

| 层 | 测试 | 说明 |
|---|---|---|
| packages/core | 单元测试 | 路由 4 策略 / 限流 3 算法 + 并发 / 熔断状态机 + 半开 / 成本微元 / 事件总线 |
| packages/storage | 仓储测试 | CRUD / 聚合 / 迁移幂等 / 内存 fallback |
| packages/providers | 适配器测试 | mock 全链路 / Anthropic 协议转换 / SSE 解析 / 错误映射 |
| apps/gateway | 集成测试 | chat 流程 / failover / stream / key 生命周期 / 限流 / 熔断 / 成本 |
| apps/web | 组件测试 | 格式化 / 登录表单 / store |

## 覆盖率目标

- core/storage/providers 核心包行覆盖率 ≥ 80%

## 运行

```bash
pnpm test          # 全仓
pnpm test:core     # 仅 core
pnpm test:gateway  # 仅 gateway
```
