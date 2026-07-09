import { OnboardSchoolForm } from "@/features/platform/components/onboard-school-form";

export default function OnboardSchoolPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Onboard a school</h1>
        <p className="text-sm text-muted-foreground">
          Creates the school and its first School Admin account.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <OnboardSchoolForm />
      </div>
    </div>
  );
}
