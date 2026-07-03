import { apiClient } from "@/lib/api-client";
import type { StudentInput } from "./schemas";
import type { Student } from "./types";

// Transport layer for the backend's `/api/students` routes. No React here —
// hooks in `hooks.ts` wrap these with TanStack Query.
export const studentApi = {
  create: (input: StudentInput) =>
    apiClient.post<Student>("/students", input).then((r) => r.data),
};
