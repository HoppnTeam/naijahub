import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserManagementTable } from "@/components/admin/users/UserManagementTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Users() {
  return (
    <AdminLayout>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <UserManagementTable />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}