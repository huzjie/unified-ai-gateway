import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';

/** 路由表（懒加载） */
export const routes = [
  { path: '/', name: '仪表盘' },
  { path: '/keys', name: 'API Keys' },
  { path: '/providers', name: 'Providers' },
  { path: '/routes', name: '路由规则' },
  { path: '/logs', name: '请求日志' },
  { path: '/settings', name: '系统设置' },
  { path: '/audit', name: '审计日志' },
  { path: '/export', name: '导出' },
];

/** 登录守卫 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

/** 游客守卫（已登录跳首页） */
export function GuestOnly({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
