import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        Schools are onboarded by EduLedger. Contact your platform admin for
        access.
      </p>
    </div>
  );
}
