# Ollama 本地适配说明

- 类型：`ollama`
- 接口：`http://localhost:11434/api/chat`（本地）
- 鉴权：无需
- 模型：llama3.1 / qwen2.5 / mistral 等本地模型
- 流式：NDJSON（每行一个 JSON）

## 配置示例

```yaml
providers:
  - name: ollama-local
    type: ollama
    baseUrl: http://localhost:11434
    models: [llama3.1]
    pricing:
      llama3.1: { input: 0, output: 0 }
```
