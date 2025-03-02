import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/admin/LoadingState";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const Analytics = () => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["analytics-stats"],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalPosts },
        { count: totalComments },
        { count: totalLikes },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase.from("likes").select("*", { count: "exact", head: true }),
      ]);

      return [
        { name: "Users", count: totalUsers || 0 },
        { name: "Posts", count: totalPosts || 0 },
        { name: "Comments", count: totalComments || 0 },
        { name: "Likes", count: totalLikes || 0 },
      ];
    },
  });

  const { data: activityData, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["user-activity"],
    queryFn: async () => {
      const { data: logs } = await supabase
        .from("activity_logs")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!logs) return [];

      // Group by date
      const groupedData = logs.reduce((acc, log) => {
        const date = new Date(log.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date]++;
        return acc;
      }, {});

      // Convert to array format for chart
      return Object.entries(groupedData).map(([date, count]) => ({
        date,
        activities: count,
      }));
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>

        {(isLoadingStats || isLoadingActivity) ? (
          <LoadingState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats?.map((stat) => (
                <Card key={stat.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.count}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>User Activity (Last 100 Actions)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="activities"
                        fill="#32a852"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Analytics;