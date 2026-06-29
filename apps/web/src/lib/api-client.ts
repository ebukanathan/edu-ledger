import axios, { type AxiosError } from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Shared axios instance for talking to the EduLedger backend (`/api`).
 * - Attaches the bearer token from the auth store on each request.
 * - Normalizes the backend's error shape into a thrown `ApiError`.
 *
 * Every feature's `api.ts` should import this rather than calling axios directly.
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

apiClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{ message?: string; code?: string; details?: unknown }>,
  ) => {
    // 401 → session is dead; clear it so guards redirect to login.
    if (error.response?.status === 401) {
      useAuthStore.getState().clear();
    }

    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ??
        error.message ??
        "Something went wrong. Please try again.",
      code: error.response?.data?.code,
      details: error.response?.data?.details,
    };

    return Promise.reject(apiError);
  },
);
