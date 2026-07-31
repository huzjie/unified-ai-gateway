/**
 * Anthropic 默认模型清单与计价（CNY / 1K tokens）
 */
export const ANTHROPIC_MODELS: Record<string, { input: number; output: number; perRequest?: number }> = {
  'claude-3-5-sonnet': { input: 21, output: 105 },
  'claude-3-5-haiku': { input: 5.6, output: 28 },
  'claude-3-opus': { input: 105, output: 525 },
  'claude-3-haiku': { input: 1.75, output: 8.75 },
  'claude-sonnet-4': { input: 21, output: 105 },
};
