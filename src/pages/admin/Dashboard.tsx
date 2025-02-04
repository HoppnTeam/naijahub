import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserManagementTable } from "@/components/admin/users/UserManagementTable";
import { ChartBar, Users, FileText, Flag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const { data: metrics } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const [usersCount, postsCount, reportsCount, categoriesCount] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("moderation_reports").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true })
      ]);

      return [
        {
          title: "Total Users",
          value: usersCount.count?.toString() || "0",
          icon: Users,
        },
        {
          title: "Active Posts",
          value: postsCount.count?.toString() || "0",
          icon: FileText,
        },
        {
          title: "Reports",
          value: reportsCount.count?.toString() || "0",
          icon: Flag,
        },
        {
          title: "Categories",
          value: categoriesCount.count?.toString() || "0",
          icon: ChartBar,
        },
      ];
    },
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics?.map((metric) => (
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