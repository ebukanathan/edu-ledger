import { apiClient } from '@/lib/api-client';
import type { Paginated } from '@/types';
import type { Payment } from './types';

// Transport layer for the backend's `/api/payments` routes.
export const paymentsApi = {
  list: (params?: { page?: number; status?: string }) =>
    apiClient
      .get<Paginated<Payment>>('/payments', { params })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Payment>(`/payments/${id}`).then((r) => r.data),
};
