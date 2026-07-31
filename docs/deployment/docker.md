# Docker Compose 部署步骤

## 1. 配置环境变量

```bash
cp .env.docker.example .env
# 编辑 .env：设置 UAG_ADMIN_PASSWORD、UAG_JWT_SECRET、UAG_PROVIDER_KEY_ENCRYPTION_KEY
```

## 2. 启动

```bash
docker compose up -d --build
```

## 3. 验证

```bash
curl http://localhost:8787/healthz
# {"status":"ok",...}
```

## 4. 访问

- 网关：http://localhost:8787
- 控制台：http://localhost:5173

## 可选 Redis（P2 共享状态）

取消 docker-compose.yml 中 redis 服务的注释即可。
