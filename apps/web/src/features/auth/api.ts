import { apiClient } from '@/lib/api-client';
import type { LoginInput, RegisterInput } from './schemas';
import type { AuthUser, LoginResponse } from './types';

// Thin transport layer for the backend's `/api/auth` routes. No React here —
// hooks in `hooks.ts` wrap these with TanStack Query.

export const authApi = {
  login: (input: LoginInput) =>
    apiClient.post<LoginResponse>('/auth/login', input).then((r) => r.data),

  register: (input: Omit<RegisterInput, 'confirmPassword'>) =>
    apiClient.post<LoginResponse>('/auth/register', input).then((r) => r.data),

  me: () => apiClient.get<AuthUser>('/auth/me').then((r) => r.data),

  logout: () => apiClient.post('/auth/logout').then((r) => r.data),
};
