import { http } from './http';

export const exportApi = {
  async csv(params: { startTime?: string; endTime?: string; model?: string } = {}): Promise<string> {
    const res = await http.get<string>('/export/csv', { params, responseType: 'text' });
    return res.data;
  },
};
