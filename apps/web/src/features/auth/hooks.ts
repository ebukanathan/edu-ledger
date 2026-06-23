'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from './api';
import type { LoginInput, RegisterInput } from './schemas';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

/** Authoritative current-user query, gated on having a token. */
export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    enabled: Boolean(token),
  });
}

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: ({ token, user }) => {
      setSession(token, user);
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: ({ confirmPassword: _ignored, ...input }: RegisterInput) =>
      authApi.register(input),
    onSuccess: ({ token, user }) => {
      setSession(token, user);
      router.push('/dashboard');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clear();
      queryClient.clear();
      router.push('/login');
    },
  });
}
