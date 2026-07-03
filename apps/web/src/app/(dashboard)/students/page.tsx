import { StudentRegisterForm } from "@/features/student/components/student-registerForm";

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Register student</h1>
        <p className="text-sm text-muted-foreground">
          Add a new student to your school.
        </p>
      </div>
      <div className="max-w-md">
        <StudentRegisterForm />
      </div>
    </div>
  );
}
