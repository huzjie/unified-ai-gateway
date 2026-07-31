import { http } from './http';
import { useAuthStore } from '../store/auth-store';

/** 拦截器（token 注入 / 错误统一 / 401 跳转） */
export function setupInterceptors(): void {
  http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  http.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    },
  );
}
