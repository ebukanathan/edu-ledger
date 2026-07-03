"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, type StudentInput } from "../schemas";
import { useCreateStudent } from "../hooks";

/**
 * Student registration form — react-hook-form + zod validation, submits via the
 * `useCreateStudent` mutation. Replace the raw inputs with shadcn/ui
 * <Form>/<Input>/<Button> once those components are generated.
 */
export function StudentRegisterForm() {
  const createStudent = useCreateStudent();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = handleSubmit((values) =>
    createStudent.mutate(values, { onSuccess: () => reset() }),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="firstName" className="text-sm font-medium">
          First name
        </label>
        <input
          id="firstName"
          type="text"
          autoComplete="given-name"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-sm text-destructive">{errors.firstName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="lastName" className="text-sm font-medium">
          Last name
        </label>
        <input
          id="lastName"
          type="text"
          autoComplete="family-name"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className="text-sm text-destructive">{errors.lastName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="studentNo" className="text-sm font-medium">
          Student number
        </label>
        <input
          id="studentNo"
          type="text"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("studentNo")}
        />
        {errors.studentNo && (
          <p className="text-sm text-destructive">{errors.studentNo.message}</p>
        )}
      </div>

      {createStudent.isError && (
        <p className="text-sm text-destructive">
          {(createStudent.error as { message?: string })?.message ??
            "Registration failed"}
        </p>
      )}

      {createStudent.isSuccess && (
        <p className="text-sm text-green-600">Student registered.</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || createStudent.isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {createStudent.isPending ? "Registering…" : "Register student"}
      </button>
    </form>
  );
}
