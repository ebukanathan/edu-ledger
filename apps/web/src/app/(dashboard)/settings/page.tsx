import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold">Change password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
