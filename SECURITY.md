# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities by opening a private issue or emailing the maintainers.

Do **not** create public issues for security vulnerabilities.

## Security Baseline

- API Key 仅存不可逆哈希（SHA-256 + salt）
- Provider API Key 落库前 AES-256-GCM 加密
- 管理面 JWT 有效期 8h
- 生产强制 HTTPS（部署层终结 TLS）
