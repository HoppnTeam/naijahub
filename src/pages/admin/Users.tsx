import { UserManagementTable } from "@/components/admin/users/UserManagementTable";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";

export default function Users() {
  return (
    <ProtectedAdminRoute>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <UserManagementTable />
      </div>
    </ProtectedAdminRoute>
  );
}