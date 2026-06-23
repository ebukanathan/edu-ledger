import { apiClient } from '@/lib/api-client';
import type { Paginated } from '@/types';
import type { ReconciliationEntry } from './types';

// Transport layer for the backend's `/api/reconciliation` routes.
export const reconciliationApi = {
  list: (params?: { page?: number; status?: string }) =>
    apiClient
      .get<Paginated<ReconciliationEntry>>('/reconciliation', { params })
      .then((r) => r.data),
};
