# OpenAI 适配说明

- 类型：`openai`
- 接口：`https://api.openai.com/v1`（OpenAI 兼容直通）
- 鉴权：`Authorization: Bearer <api-key>`
- 模型：gpt-4o / gpt-4o-mini / gpt-4-turbo / gpt-3.5-turbo / gpt-5.6
- SSE：标准 OpenAI 格式

## 配置示例

```yaml
providers:
  - name: openai-prod
    type: openai
    baseUrl: https://api.openai.com/v1
    apiKey: sk-xxx
    models: [gpt-4o, gpt-4o-mini]
    pricing:
      gpt-4o: { input: 17.5, output: 70 }
```
