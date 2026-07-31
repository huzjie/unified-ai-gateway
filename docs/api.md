# API 总览与鉴权

## 开放 API（/v1/*）

- `POST /v1/chat/completions` — OpenAI 兼容对话（支持 stream:true）
- `GET /v1/models` — 可用模型列表

鉴权：`Authorization: Bearer sk-xxx`（API Key，哈希存储校验）。

## 管理 API（/admin/*）

- `POST /admin/auth/login` — 管理员登录 → JWT（8h）
- `/admin/keys` — API Key CRUD
- `/admin/providers` — Provider CRUD + 测试连接
- `/admin/routes` — 路由规则 CRUD + dry-run
- `/admin/logs` — 请求日志查询
- `/admin/stats` — 用量统计聚合
- `/admin/dashboard` — 仪表盘聚合
- `/admin/settings` — 系统设置
- `/admin/audit` — 审计日志
- `/admin/export/csv` — 用量报表导出

鉴权：`Authorization: Bearer <jwt>`。

## 统一响应

管理面：`{ code: 0, data: T, message: 'ok' }`；业务错误 `code` 为 `UAG-XXXX`。
开放 API 错误完全兼容 OpenAI：`{ error: { message, type, param, code } }`。
