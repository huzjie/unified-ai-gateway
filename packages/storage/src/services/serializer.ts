/**
 * JSON 字段序列化（models/pricing 等 TEXT 列）
 */
export class Serializer {
  static serialize(value: unknown): string {
    return JSON.stringify(value);
  }

  static deserialize<T>(text: string | null | undefined, fallback: T): T {
    if (!text) {
      return fallback;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      return fallback;
    }
  }

  static stringArray(text: string | null | undefined): string[] {
    const value = Serializer.deserialize<string[]>(text, []);
    return Array.isArray(value) ? value : [];
  }

  static record(text: string | null | undefined): Record<string, unknown> {
    const value = Serializer.deserialize<Record<string, unknown>>(text, {});
    return value && typeof value === 'object' ? value : {};
  }
}
