"use client";

import { useUsers } from "../hooks";

const ROLE_LABELS: Record<string, string> = {
  school_admin: "School Admin",
  finance_officer: "Finance Officer",
  teacher: "Teacher",
  admissions_officer: "Admissions Officer",
};

export function UsersTable() {
  const { data: users, isLoading, isError } = useUsers();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading users…</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">Could not load users.</p>;
  }

  if (!users || users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No staff accounts yet. Create one below.
      </p>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b text-muted-foreground">
          <th className="py-2 font-medium">Name</th>
          <th className="py-2 font-medium">Email</th>
          <th className="py-2 font-medium">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b last:border-0">
            <td className="py-2">{user.name}</td>
            <td className="py-2">{user.email}</td>
            <td className="py-2">{ROLE_LABELS[user.role] ?? user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
