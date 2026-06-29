"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schoolRegisterSchema, type SchoolRegisterInput } from "../schemas";
import { useLogin, useSchoolRegister } from "../hooks";

/**
 * School registration form — react-hook-form + zod validation, submits via the `useSchoolRegister`
 * mutation. Replace the raw inputs with shadcn/ui <Form>/<Input>/<Button>
 * once those components are generated (`npx shadcn@latest add form input button`).
 */
export function SchoolRegisterForm() {
  const schoolRegister = useSchoolRegister();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SchoolRegisterInput>({
    resolver: zodResolver(schoolRegisterSchema),
  });

  const onSubmit = handleSubmit((values) => schoolRegister.mutate(values));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="given-name"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {schoolRegister.isError && (
        <p className="text-sm text-destructive">
          {(schoolRegister.error as { message?: string })?.message ??
            "Registration failed"}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || schoolRegister.isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {schoolRegister.isPending ? "Signing up…" : "Sign up"}
      </button>
    </form>
  );
}
