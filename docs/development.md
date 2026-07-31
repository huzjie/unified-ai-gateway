# 本地开发指南

## 环境

- Node.js 20+
- pnpm 9+

## 安装

```bash
pnpm install
```

## 常用命令

| 命令 | 说明 |
|---|---|
| pnpm build | 全仓构建 |
| pnpm test | 全仓测试 |
| pnpm lint | 全仓 lint |
| pnpm typecheck | 全仓类型检查 |
| npm run dev | 启动网关（需 .env） |
| npm run dev:web | 启动控制台（:5173） |
| pnpm --filter @uag/core test | 仅 core 测试 |

## 调试

- 网关日志为 JSON Lines，设置 UAG_LOG_LEVEL=debug 输出调试
- Swagger UI：http://localhost:8787/docs
- 健康检查：http://localhost:8787/healthz
