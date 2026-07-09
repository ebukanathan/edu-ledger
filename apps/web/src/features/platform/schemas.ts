import { z } from "zod";

// Mirror of the backend's `platform.validation.ts`.
export const onboardSchoolSchema = z.object({
  school: z.object({
    name: z.string().min(2, "School name is required"),
    email: z.string().email("Enter a valid school email"),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  admin: z.object({
    name: z.string().min(2, "School admin name is required"),
    email: z.string().email("Enter a valid school admin email"),
  }),
});

export type OnboardSchoolInput = z.infer<typeof onboardSchoolSchema>;
