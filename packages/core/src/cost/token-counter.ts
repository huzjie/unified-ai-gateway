import type { ChatMessage, Usage } from '@uag/types';

/**
 * Token 计数估算
 * 上游未提供 usage 时使用：字符数 / 4 近似（中英文混合粗略估计）。
 */
export class TokenCounter {
  /** 估算单条消息 token */
  estimateMessage(message: ChatMessage): number {
    const content = Array.isArray(message.content)
      ? message.content.map((part) => JSON.stringify(part)).join(' ')
      : message.content;
    return Math.max(1, Math.ceil((content.length + (message.name?.length ?? 0)) / 4));
  }

  /** 估算整组 messages 的 prompt tokens */
  estimatePrompt(messages: ChatMessage[]): number {
    let total = 0;
    for (const message of messages) {
      total += this.estimateMessage(message);
      // 角色标记 +3 tokens
      total += 3;
    }
    return total;
  }

  /** 估算 completion tokens（按字符/4） */
  estimateCompletion(content: string): number {
    return Math.max(1, Math.ceil(content.length / 4));
  }

  /** 估算 usage（上游缺失时） */
  estimateUsage(messages: ChatMessage[], completion: string): Usage {
    const promptTokens = this.estimatePrompt(messages);
    const completionTokens = this.estimateCompletion(completion);
    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    };
  }
}
