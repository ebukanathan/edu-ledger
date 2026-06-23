import { QueryClient } from '@tanstack/react-query';

/** Factory so the server and each browser tab get their own QueryClient. */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min — avoids refetch storms on navigation
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
