export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: { id: string; username: string };
}

export interface AuthState {
  token: string | null;
  username: string | null;
}
