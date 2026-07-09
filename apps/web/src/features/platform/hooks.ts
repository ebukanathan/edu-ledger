"use client";

import { useMutation } from "@tanstack/react-query";
import { platformApi } from "./api";
import type { OnboardSchoolInput } from "./schemas";

export function useOnboardSchool() {
  return useMutation({
    mutationFn: (input: OnboardSchoolInput) => platformApi.onboardSchool(input),
  });
}
