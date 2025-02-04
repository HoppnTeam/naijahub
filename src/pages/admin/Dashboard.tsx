import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserManagementTable } from "@/components/admin/users/UserManagementTable";
import { ChartBar, Users, FileText, Flag } from "lucide-react";

const metrics = [
  {
    title: "Total Users",
    value: "1,234",
    icon: Users,
  },
  {
    title: "Active Posts",
    value: "456",
    icon: FileText,
  },
  {
    title: "Reports",
    value: "23",
    icon: Flag,
  },
  {
    title: "Categories",
    value: "10",
    icon: ChartBar,
  },
];

export const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagementTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};