import { http } from './http';
import type { ApiResponse, SystemSettings } from '../types';

export const settingsApi = {
  async get(): Promise<SystemSettings> {
    const res = await http.get<ApiResponse<SystemSettings>>('/settings');
    return res.data.data;
  },
  async update(patch: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await http.put<ApiResponse<SystemSettings>>('/settings', patch);
    return res.data.data;
  },
};
