# DeepSeek 适配说明

- 类型：`deepseek`
- 接口：`https://api.deepseek.com/v1`（OpenAI 兼容）
- 鉴权：`Authorization: Bearer <api-key>`
- 模型：deepseek-chat / deepseek-reasoner / deepseek-v4 / deepseek-v4-flash
- 特点：性价比高，适合成本优先策略

## 配置示例

```yaml
providers:
  - name: deepseek-prod
    type: deepseek
    baseUrl: https://api.deepseek.com/v1
    apiKey: sk-xxx
    models: [deepseek-chat, deepseek-reasoner]
    pricing:
      deepseek-chat: { input: 1, output: 2 }
```
