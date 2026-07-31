# FAQ

## 部署

**Q: 如何快速启动？**
A: `pnpm install` → `cp .env.example .env` → `npm run dev`（网关）+ `npm run dev:web`（控制台）。或 `docker compose up -d --build`。

**Q: UAG_PROVIDER_KEY_ENCRYPTION_KEY 是什么？**
A: Provider API Key 的 AES-256-GCM 加密密钥（至少 16 字符）。未配置或过短时网关拒绝启动。

**Q: 生产必须改哪些配置？**
A: UAG_ADMIN_PASSWORD、UAG_JWT_SECRET、UAG_PROVIDER_KEY_ENCRYPTION_KEY。

## 路由

**Q: 如何让请求自动故障转移？**
A: 创建路由规则，targets 按候选顺序排列（如 moonshot → deepseek），策略选 priority/failover。主 Provider 故障时自动切后备。

**Q: 模型别名是什么？**
A: 虚拟模型名映射到 Provider 候选列表，业务侧只认逻辑名。

## 成本

**Q: 成本如何计算？**
A: 配置文件声明单价（CNY/1K tokens）× token 用量，整数微元运算。

**Q: Token 从哪来？**
A: 优先上游 usage；缺失时按字符数/4 估算。

## 限流

**Q: 429 会返回什么？**
A: 标准 429 + `Retry-After` 头 + OpenAI 兼容错误体（UAG-3001）。

**Q: 每 Key 限流如何配置？**
A: 创建 Key 时设置 qpsLimit / concurrencyLimit。
