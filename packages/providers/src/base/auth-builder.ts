/**
 * 鉴权头构建（Bearer/自定义）
 */
export class AuthBuilder {
  /** Bearer 鉴权 */
  static bearer(apiKey: string): Record<string, string> {
    return { authorization: `Bearer ${apiKey}` };
  }

  /** 自定义头名鉴权（如 x-api-key） */
  static header(name: string, value: string): Record<string, string> {
    return { [name.toLowerCase()]: value };
  }

  /** Anthropic 风格：x-api-key + anthropic-version */
  static anthropic(apiKey: string, version = '2023-06-01'): Record<string, string> {
    return {
      'x-api-key': apiKey,
      'anthropic-version': version,
    };
  }

  /** 无鉴权（Ollama/Mock） */
  static none(): Record<string, string> {
    return {};
  }
}
