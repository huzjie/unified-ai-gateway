# @uag/providers

统一 AI 网关 Provider 适配器层：实现统一的 `ProviderAdapter` 接口，负责 OpenAI 兼容协议 ↔ 各家原生协议转换、鉴权、SSE 透传/转换。

## 适配器

- `base/` — 抽象基类（http-client / request-builder / response-parser / error-mapper / sse-parser / stream-transformer / timeout / retry / headers / auth / body-normalizer）
- `openai/` — OpenAI（直通）
- `moonshot/` — Kimi / Moonshot
- `deepseek/` — DeepSeek
- `minimax/` — MiniMax
- `anthropic/` — Anthropic（messages API 协议转换）
- `ollama/` — Ollama 本地（/api/chat）
- `mock/` — 内存假 Provider（测试/演示，真实逻辑）
- `registry/` — Provider 注册表
- `factory/` — 按类型/配置创建适配器
- `health/` — 健康检查
