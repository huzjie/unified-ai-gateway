/**
 * DeepSeek 默认模型清单与计价（CNY / 1K tokens）
 */
export const DEEPSEEK_MODELS: Record<string, { input: number; output: number; perRequest?: number }> = {
  'deepseek-chat': { input: 1, output: 2 },
  'deepseek-reasoner': { input: 4, output: 16 },
  'deepseek-v4': { input: 2, output: 8 },
  'deepseek-v4-flash': { input: 0.5, output: 1.5 },
};
