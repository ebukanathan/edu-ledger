import { UsersTable } from "@/features/users/components/users-table";
import { CreateUserForm } from "@/features/users/components/create-user-form";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground">
          Manage staff accounts and roles for your school.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Staff</h2>
          <UsersTable />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Add a staff member</h2>
          <CreateUserForm />
        </section>
      </div>
    </div>
  );
}
