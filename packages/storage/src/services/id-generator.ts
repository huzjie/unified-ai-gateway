import { randomUUID } from 'node:crypto';

/**
 * 主键 ID 生成
 */
export class IdGenerator {
  static uuid(): string {
    return randomUUID();
  }

  static prefix(prefix: string): string {
    return `${prefix}_${randomUUID()}`;
  }

  /** 业务 ID：prov_xxx / key_xxx / rule_xxx */
  static provider(): string {
    return IdGenerator.prefix('prov');
  }

  static apiKey(): string {
    return IdGenerator.prefix('key');
  }

  static routeRule(): string {
    return IdGenerator.prefix('rule');
  }

  static log(): string {
    return IdGenerator.prefix('log');
  }

  static audit(): string {
    return IdGenerator.prefix('audit');
  }

  static cache(): string {
    return IdGenerator.prefix('cache');
  }
}
