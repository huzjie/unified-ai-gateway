/**
 * 通用请求头构建
 */
export class HeadersBuilder {
  static json(): Record<string, string> {
    return { 'content-type': 'application/json' };
  }

  static acceptSse(): Record<string, string> {
    return { accept: 'text/event-stream', 'content-type': 'application/json' };
  }

  /** 合并多个头 */
  static merge(...headers: Array<Record<string, string> | undefined>): Record<string, string> {
    return Object.assign({}, ...headers.filter(Boolean));
  }

  /** 附加自定义头（不覆盖既有） */
  static withExtra(base: Record<string, string>, extra?: Record<string, string>): Record<string, string> {
    return { ...base, ...(extra ?? {}) };
  }
}
