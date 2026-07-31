import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../types';
import { authApi } from '../api-client/auth-api';

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      login: async (username, password) => {
        const result = await authApi.login(username, password);
        set({ token: result.token, username: result.user.username });
      },
      logout: () => set({ token: null, username: null }),
    }),
    { name: 'uag-auth' },
  ),
);
