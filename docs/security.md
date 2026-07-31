# 安全基线

## API Key 安全

- API Key 明文仅创建时返回一次
- 落库仅存不可逆哈希（SHA-256 + salt，格式 salt:hash）
- 支持吊销与过期

## Provider Key 安全

- Provider API Key 落库前 AES-256-GCM 加密（密钥来自 UAG_PROVIDER_KEY_ENCRYPTION_KEY）
- 未配置加密密钥时拒绝启动
- 管理面展示始终脱敏

## 管理面安全

- 管理 API 强制 JWT（8h 有效期）
- 登录失败记录审计
- 生产强制 HTTPS（由 Nginx/Ingress 终结 TLS）

## 审计

- 管理操作写入 audit_logs
- API 调用写入 usage_logs
- 日志可配置保留策略（UAG_LOG_RETENTION_DAYS）
