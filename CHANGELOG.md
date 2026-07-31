# Changelog

## [1.0.0] - 2026-07-31

### Added
- OpenAI 兼容 `/v1/chat/completions`（含 SSE 流式）与 `/v1/models`
- 7 类 Provider 适配器：OpenAI / Kimi(Moonshot) / DeepSeek / MiniMax / Anthropic / Ollama / Mock
- 智能路由：优先级 / 故障转移 / 成本优先 / 随机
- 限流：token-bucket / fixed-window / sliding-window / 并发限制
- 熔断：CLOSED/OPEN/HALF_OPEN 状态机 + 半开探测
- 成本追踪：配置单价 × token 用量，整数微元运算
- better-sqlite3 存储（10 张表 + 迁移）
- React 管理控制台（仪表盘/Key/Provider/路由/日志/设置）
- gateway-cli 命令行管理工具
- Docker / Docker Compose 一键部署
- GitHub Actions CI/CD
