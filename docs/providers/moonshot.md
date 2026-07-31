# Kimi / Moonshot 适配说明

- 类型：`moonshot`
- 接口：`https://api.moonshot.cn/v1`（OpenAI 兼容）
- 鉴权：`Authorization: Bearer <api-key>`
- 模型：kimi-k3 / kimi-k2 / kimi-latest / moonshot-v1-*
- 特点：Kimi K3 为开源超大模型，可用性波动，建议配置 fallback

## 配置示例

```yaml
providers:
  - name: moonshot-prod
    type: moonshot
    baseUrl: https://api.moonshot.cn/v1
    apiKey: sk-xxx
    models: [kimi-k3]
    pricing:
      kimi-k3: { input: 4, output: 16 }
```
