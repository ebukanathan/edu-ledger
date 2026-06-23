import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/features/auth/types';

/**
 * Client-side auth/session state. Holds the bearer token + current user and
 * persists them to localStorage so a refresh keeps the user signed in.
 *
 * This is UI/session state only — server data (the authoritative user record)
 * is fetched via TanStack Query in `features/auth/hooks`.
 */
interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: (token, user) => set({ token, user, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      clear: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'eduledger-auth' },
  ),
);
