"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardSchoolSchema, type OnboardSchoolInput } from "../schemas";
import { useOnboardSchool } from "../hooks";

/**
 * Onboards a new school: creates the School and its first School Admin in
 * one step. There is no email delivery yet, so on success we surface the
 * generated temporary password directly so it can be relayed to the admin.
 */
export function OnboardSchoolForm() {
  const onboardSchool = useOnboardSchool();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OnboardSchoolInput>({
    resolver: zodResolver(onboardSchoolSchema),
  });

  const onSubmit = handleSubmit((values) =>
    onboardSchool.mutate(values, { onSuccess: () => reset() }),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-semibold">School</legend>

        <div className="flex flex-col gap-1">
          <label htmlFor="school.name" className="text-sm font-medium">
            School name
          </label>
          <input
            id="school.name"
            type="text"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("school.name")}
          />
          {errors.school?.name && (
            <p className="text-sm text-destructive">{errors.school.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="school.email" className="text-sm font-medium">
            School email
          </label>
          <input
            id="school.email"
            type="email"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("school.email")}
          />
          {errors.school?.email && (
            <p className="text-sm text-destructive">{errors.school.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="school.phone" className="text-sm font-medium">
            Phone <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="school.phone"
            type="tel"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("school.phone")}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="school.address" className="text-sm font-medium">
            Address <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="school.address"
            type="text"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("school.address")}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-semibold">School Admin</legend>

        <div className="flex flex-col gap-1">
          <label htmlFor="admin.name" className="text-sm font-medium">
            Admin name
          </label>
          <input
            id="admin.name"
            type="text"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("admin.name")}
          />
          {errors.admin?.name && (
            <p className="text-sm text-destructive">{errors.admin.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="admin.email" className="text-sm font-medium">
            Admin email
          </label>
          <input
            id="admin.email"
            type="email"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("admin.email")}
          />
          {errors.admin?.email && (
            <p className="text-sm text-destructive">{errors.admin.email.message}</p>
          )}
        </div>
      </fieldset>

      {onboardSchool.isError && (
        <p className="text-sm text-destructive">
          {(onboardSchool.error as { message?: string })?.message ??
            "Could not onboard school"}
        </p>
      )}

      {onboardSchool.isSuccess && (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
          <p className="font-medium">
            {onboardSchool.data.school.name} was onboarded.
          </p>
          <p className="text-muted-foreground">
            Share this temporary password with {onboardSchool.data.admin.email}:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
              {onboardSchool.data.temporaryPassword}
            </code>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || onboardSchool.isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {onboardSchool.isPending ? "Onboarding…" : "Onboard school"}
      </button>
    </form>
  );
}
