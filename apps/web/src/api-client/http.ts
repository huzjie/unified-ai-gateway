import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/admin';

/** axios 实例 */
export const http = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'content-type': 'application/json',
  },
});
