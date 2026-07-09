import { z } from "zod";

// Mirror of the backend's `auth.validation.ts` input schemas. Keeping a copy
// here lets us validate forms client-side before hitting the API.

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
