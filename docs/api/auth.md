# JWT 登录与会话

## 登录

```bash
curl -X POST http://localhost:8787/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

返回：

```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOi...",
    "expiresAt": "2026-08-01T00:00:00.000Z",
    "user": { "id": "admin", "username": "admin" }
  },
  "message": "ok"
}
```

## 使用

所有管理 API 需要 `Authorization: Bearer <token>`。JWT 有效期 8h，过期返回 401（UAG-2005）。

## 初始化

管理员账号密码来自 `.env` 的 `UAG_ADMIN_USERNAME` / `UAG_ADMIN_PASSWORD`。
