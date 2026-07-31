/**
 * 用量
 */
export interface Usage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** Token 计数明细 */
export interface TokenCount {
  input: number;
  output: number;
}

/** 空用量 */
export const EMPTY_USAGE: Usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
