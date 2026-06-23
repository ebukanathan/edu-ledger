'use client';

import { useQuery } from '@tanstack/react-query';
import { reconciliationApi } from './api';

export const reconciliationKeys = {
  all: ['reconciliation'] as const,
  list: (params?: { page?: number; status?: string }) =>
    [...reconciliationKeys.all, 'list', params ?? {}] as const,
};

export function useReconciliation(params?: { page?: number; status?: string }) {
  return useQuery({
    queryKey: reconciliationKeys.list(params),
    queryFn: () => reconciliationApi.list(params),
  });
}
