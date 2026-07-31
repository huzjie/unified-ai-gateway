import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * 登录令牌管理（本地 .gateway-cli.json）
 */
class Auth {
  private readonly configPath = join(homedir(), '.gateway-cli.json');

  getToken(): string | null {
    return process.env.GATEWAY_CLI_TOKEN ?? this.readConfig()?.token ?? null;
  }

  saveToken(token: string): void {
    const dir = this.configPath.slice(0, this.configPath.lastIndexOf('/'));
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(this.configPath, JSON.stringify({ token }, null, 2));
  }

  clearToken(): void {
    if (existsSync(this.configPath)) {
      writeFileSync(this.configPath, '{}');
    }
  }

  private readConfig(): { token?: string } | null {
    try {
      if (!existsSync(this.configPath)) {
        return null;
      }
      return JSON.parse(readFileSync(this.configPath, 'utf-8'));
    } catch {
      return null;
    }
  }
}

export const auth = new Auth();
