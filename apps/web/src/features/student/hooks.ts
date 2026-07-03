"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "./api";
import type { StudentInput } from "./schemas";

export const studentKeys = {
  all: ["students"] as const,
};

/** Registers a new student, then invalidates any cached student lists. */
export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StudentInput) => studentApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}
