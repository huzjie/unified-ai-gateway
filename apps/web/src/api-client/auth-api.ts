import { http } from './http';
import type { ApiResponse, LoginResponse } from '../types';

export const authApi = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await http.post<ApiResponse<LoginResponse>>('/auth/login', { username, password });
    return res.data.data;
  },
};
