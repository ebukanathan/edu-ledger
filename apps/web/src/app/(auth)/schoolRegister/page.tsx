import Link from "next/link";
import { SchoolRegisterForm } from "@/features/auth/components/school-registerForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold">School Registration</h1>
        <p className="text-sm text-muted-foreground">
          Get started with EduLedger
        </p>
      </div>
      {/* TODO: build SchoolRegisterForm in features/auth/components, mirroring
          login-form.tsx with schoolRegisterSchema + useSchoolRegister(). */}
      <SchoolRegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
