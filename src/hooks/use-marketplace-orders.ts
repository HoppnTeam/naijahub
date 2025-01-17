import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useMarketplaceOrders = () => {
  const { user } = useAuth();

  const { data: techOrders, isLoading: techLoading } = useQuery({
    queryKey: ["tech-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("tech_marketplace_orders")
        .select(`
          *,
          listing:tech_marketplace_listings!tech_marketplace_orders_listing_id_fkey (
            title,
            images
          ),
          buyer:profiles!tech_marketplace_orders_buyer_id_profiles_fkey (
            username,
            user_id
          ),
          seller:profiles!tech_marketplace_orders_seller_id_profiles_fkey (
            username,
            user_id
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tech orders:", error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: autoOrders, isLoading: autoLoading } = useQuery({
    queryKey: ["auto-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("auto_marketplace_orders")
        .select(`
          *,
          listing:auto_marketplace_listings!auto_marketplace_orders_listing_id_fkey (
            title,
            images
          ),
          buyer:profiles!auto_marketplace_orders_buyer_id_fkey (
            username,
            user_id
          ),
          seller:profiles!auto_marketplace_orders_seller_id_fkey (
            username,
            user_id
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching auto orders:", error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  return {
    techOrders,
    autoOrders,
    isLoading: techLoading || autoLoading,
  };
};