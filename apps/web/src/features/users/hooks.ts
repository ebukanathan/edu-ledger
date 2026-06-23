'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from './api';

export const userKeys = {
  all: ['users'] as const,
  list: (params?: { page?: number }) =>
    [...userKeys.all, 'list', params ?? {}] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

export function useUsers(params?: { page?: number }) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.list(params),
  });
}
