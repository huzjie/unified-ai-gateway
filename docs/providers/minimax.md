# MiniMax 适配说明

- 类型：`minimax`
- 接口：`https://api.minimax.chat/v1`（OpenAI 兼容变体）
- 鉴权：`Authorization: Bearer <api-key>`，可选 `x-group-id` 头
- 模型：MiniMax-Text-01 / abab6.5s-chat / MiniMax-M2

## 配置示例

```yaml
providers:
  - name: minimax-prod
    type: minimax
    baseUrl: https://api.minimax.chat/v1
    apiKey: sk-xxx
    groupId: your-group-id
    models: [MiniMax-Text-01]
```
