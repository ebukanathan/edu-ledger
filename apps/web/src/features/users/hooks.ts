'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from './api';
import type { CreateSchoolUserInput } from './schemas';

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: usersApi.list,
  });
}

export function useCreateSchoolUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSchoolUserInput) => usersApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}
