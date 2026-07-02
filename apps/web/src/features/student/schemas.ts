import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  studentNo: z.string().min(5, "Student number is required"),
});

export type StudentInput = z.infer<typeof studentSchema>;
