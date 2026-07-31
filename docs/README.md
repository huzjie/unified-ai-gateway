# Unified AI Gateway 文档导航

## 总览

- [架构](architecture.md) — 分层 + 插件化架构详解
- [开发指南](development.md) — 本地环境与命令
- [测试策略](testing.md) — 单元/集成测试与覆盖率
- [监控](monitoring.md) — 日志/指标/健康检查

## API 参考

- [API 总览](api.md) — 开放 API 与管理 API
- [chat](api/chat.md) — /v1/chat/completions（含流式）
- [models](api/models.md) — /v1/models
- [管理 API](api/admin.md) — 全量端点
- [鉴权](api/auth.md) — JWT 登录与会话
- [错误码](api/errors.md) — UAG-XXXX 错误码表

## Provider

- [Provider 接入指南](providers.md) — 如何写新适配器
- [OpenAI](providers/openai.md) / [Moonshot](providers/moonshot.md) / [DeepSeek](providers/deepseek.md) / [MiniMax](providers/minimax.md) / [Anthropic](providers/anthropic.md) / [Ollama](providers/ollama.md)

## 路由与成本

- [路由规则](routing.md) — 4 种策略详解
- [成本说明](cost.md) — 计价表与微元运算

## 部署与安全

- [部署总览](deployment.md) / [Docker](deployment/docker.md) / [K8s](deployment/k8s.md)
- [安全基线](security.md)
- [FAQ](faq.md)

## 图表

- [类图](class-diagram.mermaid)
- [时序图](sequence-diagram.mermaid)
