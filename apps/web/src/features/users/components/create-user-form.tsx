"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchoolUserSchema, type CreateSchoolUserInput } from "../schemas";
import { useCreateSchoolUser } from "../hooks";

const ROLE_LABELS: Record<CreateSchoolUserInput["role"], string> = {
  FINANCE_OFFICER: "Finance Officer",
  TEACHER: "Teacher",
  ADMISSIONS_OFFICER: "Admissions Officer",
};

/**
 * Creates a staff account for the signed-in School Admin's own school.
 * There is no email delivery yet, so on success we surface the generated
 * temporary password directly so it can be shared with the new user.
 */
export function CreateUserForm() {
  const createUser = useCreateSchoolUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSchoolUserInput>({
    resolver: zodResolver(createSchoolUserSchema),
  });

  const onSubmit = handleSubmit((values) =>
    createUser.mutate(values, { onSuccess: () => reset() }),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="role" className="text-sm font-medium">
          Role
        </label>
        <select
          id="role"
          defaultValue=""
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register("role")}
        >
          <option value="" disabled>
            Select a role
          </option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      {createUser.isError && (
        <p className="text-sm text-destructive">
          {(createUser.error as { message?: string })?.message ??
            "Could not create user"}
        </p>
      )}

      {createUser.isSuccess && (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
          <p className="font-medium">
            {createUser.data.user.name} was created.
          </p>
          <p className="text-muted-foreground">
            Share this temporary password with them:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
              {createUser.data.temporaryPassword}
            </code>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || createUser.isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {createUser.isPending ? "Creating…" : "Create user"}
      </button>
    </form>
  );
}
