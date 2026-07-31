import type { ISODateTime } from '../common/timestamp';

/** 管理员用户 */
export interface AdminUser {
  id: string;
  username: string;
  /** 密码哈希（bcrypt/argon2 风格，存储为 salt:hash） */
  passwordHash: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** 登录请求 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 登录响应 */
export interface LoginResponse {
  token: string;
  expiresAt: ISODateTime;
  user: {
    id: string;
    username: string;
  };
}

/** JWT 载荷 */
export interface JwtPayload {
  sub: string;
  username: string;
  role: 'admin';
  iat: number;
  exp: number;
}
