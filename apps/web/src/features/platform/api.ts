import { apiClient } from "@/lib/api-client";
import type { OnboardSchoolResponse } from "@/types";
import type { OnboardSchoolInput } from "./schemas";

// Transport layer for the backend's `/api/platform` routes (Platform Admin
// onboarding schools).
export const platformApi = {
  onboardSchool: (input: OnboardSchoolInput) =>
    apiClient
      .post<OnboardSchoolResponse>("/platform/schools", input)
      .then((r) => r.data),
};
