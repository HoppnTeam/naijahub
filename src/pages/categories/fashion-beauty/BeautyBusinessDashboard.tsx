
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LineChart, Store, Users } from "lucide-react";

const BeautyBusinessDashboard = () => {
  const { user } = useAuth();

  const { data: professionalProfile, isLoading } = useQuery({
    queryKey: ["beauty-professional", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("beauty_professional_portfolios")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!professionalProfile) {
    return <Navigate to="/categories/fashion-beauty/beauty-professionals/register" replace />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Business Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{professionalProfile.business_name}</h3>
              <p className="text-muted-foreground">{professionalProfile.location}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Clients</h3>
              <p className="text-muted-foreground">0 Total Bookings</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <LineChart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Revenue</h3>
              <p className="text-muted-foreground">₦0 Total</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BeautyBusinessDashboard;
