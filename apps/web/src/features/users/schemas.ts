import { z } from "zod";

// Mirror of the backend's `users.validation.ts`. Role values match the DB
// enum spelling the API expects.
export const createSchoolUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["FINANCE_OFFICER", "TEACHER", "ADMISSIONS_OFFICER"], {
    message: "Select a role",
  }),
});

export type CreateSchoolUserInput = z.infer<typeof createSchoolUserSchema>;
