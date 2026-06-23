import { apiClient } from '@/lib/api-client';
import type { Paginated, User } from '@/types';

// Transport layer for the backend's `/api/users` routes.
export const usersApi = {
  list: (params?: { page?: number }) =>
    apiClient.get<Paginated<User>>('/users', { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<User>(`/users/${id}`).then((r) => r.data),
};
