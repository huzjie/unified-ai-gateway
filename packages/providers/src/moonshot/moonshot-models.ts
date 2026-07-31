/**
 * Moonshot (Kimi) 默认模型清单与计价（CNY / 1K tokens）
 */
export const MOONSHOT_MODELS: Record<string, { input: number; output: number; perRequest?: number }> = {
  'kimi-k3': { input: 4, output: 16 },
  'kimi-k2': { input: 2, output: 8 },
  'kimi-latest': { input: 4, output: 16 },
  'moonshot-v1-8k': { input: 12, output: 12 },
  'moonshot-v1-32k': { input: 24, output: 24 },
  'moonshot-v1-128k': { input: 60, output: 60 },
};
