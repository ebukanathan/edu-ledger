import { z } from "zod";

// Mirror of the backend's `auth.validation.ts` input schemas. Keeping a copy
// here lets us validate forms client-side before hitting the API.

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema
  .extend({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const schoolRegisterSchema = z.object({
  name: z.string().min(5, "school name is required"),
  email: z.string().email("Enter a valid email"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type SchoolRegisterInput = z.infer<typeof schoolRegisterSchema>;
