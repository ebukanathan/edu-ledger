'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from './api';

export const paymentKeys = {
  all: ['payments'] as const,
  list: (params?: { page?: number; status?: string }) =>
    [...paymentKeys.all, 'list', params ?? {}] as const,
  detail: (id: string) => [...paymentKeys.all, 'detail', id] as const,
};

export function usePayments(params?: { page?: number; status?: string }) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentsApi.list(params),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentsApi.get(id),
    enabled: Boolean(id),
  });
}
