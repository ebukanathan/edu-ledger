import { apiClient } from '@/lib/api-client';
import type { User } from '@/types';
import type { CreateSchoolUserInput } from './schemas';
import type { CreateSchoolUserResponse } from './types';

// Transport layer for the backend's `/api/users` routes (School Admin
// managing their own school's staff).
export const usersApi = {
  list: () => apiClient.get<User[]>('/users').then((r) => r.data),

  create: (input: CreateSchoolUserInput) =>
    apiClient.post<CreateSchoolUserResponse>('/users', input).then((r) => r.data),
};
