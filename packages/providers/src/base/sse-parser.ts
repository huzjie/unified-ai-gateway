import type { RawSSEEvent } from '@uag/types';

/**
 * SSE 字节流解析（事件/数据/完成）
 */
export class SseParser {
  /** 解析 SSE 文本为事件数组 */
  parse(text: string): RawSSEEvent[] {
    const events: RawSSEEvent[] = [];
    const lines = text.split(/\r?\n/);
    let current: Partial<RawSSEEvent> = {};
    for (const line of lines) {
      if (line === '') {
        if (current.data !== undefined) {
          events.push({ data: current.data, event: current.event, id: current.id, retry: current.retry });
        }
        current = {};
        continue;
      }
      if (line.startsWith(':')) {
        continue;
      }
      const idx = line.indexOf(':');
      const field = idx > 0 ? line.slice(0, idx) : line;
      const value = idx > 0 ? line.slice(idx + 1).trimStart() : '';
      if (field === 'data') {
        current.data = current.data ? `${current.data}\n${value}` : value;
      } else if (field === 'event') {
        current.event = value;
      } else if (field === 'id') {
        current.id = value;
      } else if (field === 'retry') {
        current.retry = Number(value);
      }
    }
    if (current.data !== undefined) {
      events.push({ data: current.data, event: current.event, id: current.id, retry: current.retry });
    }
    return events;
  }

  /** 增量解析器：喂入分片，产出完整事件 */
  createIncrementalParser(): IncrementalSseParser {
    return new IncrementalSseParser();
  }
}

/** 增量 SSE 解析器 */
export class IncrementalSseParser {
  private buffer = '';

  /** 喂入分片，返回完整事件 */
  feed(chunk: string): RawSSEEvent[] {
    this.buffer += chunk;
    const result: RawSSEEvent[] = [];
    let idx: number;
    while ((idx = this.buffer.indexOf('\n\n')) >= 0) {
      const block = this.buffer.slice(0, idx);
      this.buffer = this.buffer.slice(idx + 2);
      const parsed = new SseParser().parse(block);
      result.push(...parsed);
    }
    // 兼容 \r\n 分隔
    while ((idx = this.buffer.indexOf('\r\n\r\n')) >= 0) {
      const block = this.buffer.slice(0, idx);
      this.buffer = this.buffer.slice(idx + 4);
      const parsed = new SseParser().parse(block);
      result.push(...parsed);
    }
    return result;
  }
}
