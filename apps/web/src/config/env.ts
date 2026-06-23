// Typed access to public runtime env. Only NEXT_PUBLIC_* vars are exposed to
// the browser. Keep this the single source of truth for client config.

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '/api',
} as const;
