# 部署总览

## 部署方式

| 方式 | 说明 |
|---|---|
| Docker Compose | 一键启动 gateway + web + sqlite 卷 |
| 本地开发 | pnpm workspace + npm run dev |
| Kubernetes | manifest 示例见 deployment/k8s.md |

## 组件

- gateway：Fastify 服务（:8787），对外 OpenAI 兼容 API + 管理 API
- web：Nginx 静态托管 React 控制台（:80），/admin 反代到 gateway
- 存储：SQLite 文件卷（/app/data）

## 环境变量

见根目录 `.env.example`（UAG_* 前缀）。
