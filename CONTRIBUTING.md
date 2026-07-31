# Contributing

欢迎参与 Unified AI Gateway 的开发！

## 开发环境

- Node.js 20+
- pnpm 9+

## 提交规范

- 使用 Conventional Commits（feat/fix/docs/test/chore）
- 提交前运行 `pnpm lint` 与 `pnpm test`

## 代码结构

- `packages/types`：全仓共享类型（唯一类型来源）
- `packages/core`：路由 / 限流 / 熔断 / 成本 / 事件核心引擎
- `packages/storage`：better-sqlite3 存储层
- `packages/providers`：Provider 适配器
- `apps/gateway`：Fastify 网关服务
- `apps/web`：React 管理控制台
- `apps/cli`：gateway-cli 命令行

## 新增 Provider

1. 在 `packages/providers/src/<name>/` 下实现 `ProviderAdapter` 接口
2. 实现 request-builder / response-parser / sse-transformer / error-mapper
3. 在 factory 与 models 中注册
4. 补充单元测试

详见 [docs/providers.md](docs/providers.md)。
