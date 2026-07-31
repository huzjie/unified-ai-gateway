/**
 * MiniMax 默认模型清单与计价（CNY / 1K tokens）
 */
export const MINIMAX_MODELS: Record<string, { input: number; output: number; perRequest?: number }> = {
  'MiniMax-Text-01': { input: 1, output: 8 },
  'abab6.5s-chat': { input: 1, output: 2 },
  'abab6.5g-chat': { input: 2, output: 6 },
  'MiniMax-M2': { input: 0.5, output: 4 },
};
