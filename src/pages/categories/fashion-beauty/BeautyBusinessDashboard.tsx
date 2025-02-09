
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BusinessDashboard } from "@/components/beauty/dashboard/BusinessDashboard";
import { Navigate } from "react-router-dom";

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

  return <BusinessDashboard professional={professionalProfile} />;
};

export default BeautyBusinessDashboard;
