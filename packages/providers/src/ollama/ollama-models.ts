/**
 * Ollama 默认模型清单（本地模型无官方计价，价格按估算 0）
 */
export const OLLAMA_MODELS: Record<string, { input: number; output: number; perRequest?: number }> = {
  'llama3.1': { input: 0, output: 0 },
  'llama3.2': { input: 0, output: 0 },
  'qwen2.5': { input: 0, output: 0 },
  'mistral': { input: 0, output: 0 },
  'gemma2': { input: 0, output: 0 },
};
