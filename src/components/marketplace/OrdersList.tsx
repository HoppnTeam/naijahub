import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

export const OrdersList = () => {
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

  const renderOrders = (orders: any[], marketplace: string) => {
    if (!orders?.length) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No {marketplace} orders found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{order.listing.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {marketplace} Marketplace
                  </div>
                </div>
                <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                  {order.payment_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="aspect-square w-24 rounded-lg overflow-hidden">
                  <img
                    src={order.listing.images[0]}
                    alt={order.listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-semibold">{formatCurrency(order.amount)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {user?.id === order.buyer.user_id ? "Seller" : "Buyer"}
                  </div>
                  <div className="font-semibold">
                    {user?.id === order.buyer.user_id ? order.seller.username : order.buyer.username}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-semibold">{order.delivery_status}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (techLoading || autoLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="tech">Tech Marketplace</TabsTrigger>
        <TabsTrigger value="auto">Auto Marketplace</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-6">
        {renderOrders([...(techOrders || []), ...(autoOrders || [])].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ), "Combined")}
      </TabsContent>

      <TabsContent value="tech" className="space-y-6">
        {renderOrders(techOrders || [], "Tech")}
      </TabsContent>

      <TabsContent value="auto" className="space-y-6">
        {renderOrders(autoOrders || [], "Auto")}
      </TabsContent>
    </Tabs>
  );
};