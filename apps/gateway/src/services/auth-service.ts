import type { LoginResponse } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';
import { AppError, ErrorCode } from '@uag/core';
import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * 管理员登录/令牌
 */
export class AuthService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 登录 → JWT */
  async login(username: string, password: string): Promise<LoginResponse> {
    const config = this.runtime.config;
    const valid =
      username === config.admin.username &&
      this.constantTimeEqual(createHash('sha256').update(password).digest('hex'),
        createHash('sha256').update(config.admin.password).digest('hex'));

    if (!valid) {
      this.runtime.auditService.record('admin', 'auth.login', username, 'failure', {});
      throw new AppError(ErrorCode.ADMIN_CREDENTIALS, '用户名或密码错误');
    }

    const token = await this.runtime.jwtSign({
      sub: 'admin',
      username,
      role: 'admin',
    });
    this.runtime.auditService.record('admin', 'auth.login', username, 'success', {});
    return {
      token,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      user: { id: 'admin', username },
    };
  }

  private constantTimeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  }
}
