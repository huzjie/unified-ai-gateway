# @uag/gateway

统一 AI 网关 HTTP 服务（Fastify 5）：对外 OpenAI 兼容 API + 管理 API。

## 端点

- `POST /v1/chat/completions` — OpenAI 兼容对话（支持 SSE 流式）
- `GET /v1/models` — 可用模型列表
- `POST /admin/auth/login` — 管理员登录 → JWT
- `/admin/keys` `/admin/providers` `/admin/routes` — 管理 CRUD
- `/admin/logs` `/admin/stats` `/admin/dashboard` — 用量查询
- `/admin/settings` `/admin/audit` `/admin/export/csv` — 设置/审计/导出
- `/healthz` `/readyz` — 探针
- `/docs` — Swagger UI

## 启动

```bash
cp ../../.env.example .env
npm run dev
```
