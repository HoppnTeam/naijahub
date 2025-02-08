
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricsOverview } from "./MetricsOverview";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, 
  CalendarDays, 
  DollarSign, 
  ShoppingBag, 
  Star,
  Users 
} from "lucide-react";

interface Activity {
  id: string; // Added this missing property
  activity_date: string;
  activity_type: string;
  client_name: string;
  description: string;
  amount: number;
  status: string;
  business_id: string;
}

export const BusinessDashboard = () => {
  const { user } = useAuth();

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["business-metrics", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_metrics")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["business-activities", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_activities")
        .select("*")
        .order("activity_date", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingMetrics || isLoadingActivities) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Business Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your business performance across all services and platforms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">
                  ₦{((metrics?.total_sales || 0) + (metrics?.marketplace_revenue || 0)).toLocaleString()}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <h3 className="text-2xl font-bold">
                  {metrics?.total_bookings || 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marketplace Orders</p>
                <h3 className="text-2xl font-bold">
                  {metrics?.marketplace_orders || 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <h3 className="text-2xl font-bold">
                  {metrics?.average_rating?.toFixed(1) || "N/A"}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Your latest business activities across all platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {activities?.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 border-b py-4 last:border-0"
                >
                  <div className="p-2 bg-muted rounded">
                    {activity.activity_type === "booking" ? (
                      <CalendarDays className="w-4 h-4" />
                    ) : activity.activity_type === "marketplace_sale" ? (
                      <ShoppingBag className="w-4 h-4" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>
                        {new Date(activity.activity_date).toLocaleDateString()}
                      </span>
                      {activity.amount && (
                        <span>• ₦{activity.amount.toLocaleString()}</span>
                      )}
                      {activity.client_name && (
                        <span>• by {activity.client_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your business metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Services Revenue</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{
                        width: `${Math.min(
                          ((metrics?.total_sales || 0) /
                            ((metrics?.total_sales || 0) +
                              (metrics?.marketplace_revenue || 0))) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm">
                    ₦{(metrics?.total_sales || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Marketplace Revenue</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{
                        width: `${Math.min(
                          ((metrics?.marketplace_revenue || 0) /
                            ((metrics?.total_sales || 0) +
                              (metrics?.marketplace_revenue || 0))) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm">
                    ₦{(metrics?.marketplace_revenue || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Reviews</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{
                        width: `${Math.min(
                          ((metrics?.total_reviews || 0) / 100) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm">{metrics?.total_reviews || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
