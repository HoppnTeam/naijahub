import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const OrdersList = () => {
  const { user } = useAuth();

  const { data: buyerOrders, isLoading: isLoadingBuyer } = useQuery({
    queryKey: ["buyer-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tech_marketplace_orders")
        .select(`
          *,
          listing:tech_marketplace_listings(*),
          buyer:profiles!tech_marketplace_orders_buyer_id_profiles_fkey(username),
          seller:profiles!tech_marketplace_orders_seller_id_profiles_fkey(username)
        `)
        .eq("buyer_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: sellerOrders, isLoading: isLoadingSeller } = useQuery({
    queryKey: ["seller-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tech_marketplace_orders")
        .select(`
          *,
          listing:tech_marketplace_listings(*),
          buyer:profiles!tech_marketplace_orders_buyer_id_profiles_fkey(username),
          seller:profiles!tech_marketplace_orders_seller_id_profiles_fkey(username)
        `)
        .eq("seller_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoadingBuyer || isLoadingSeller) {
    return <div>Loading orders...</div>;
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="default">Paid</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge variant="default">Delivered</Badge>;
      case "in_transit":
        return <Badge variant="secondary">In Transit</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Tabs defaultValue="buying" className="w-full">
      <TabsList>
        <TabsTrigger value="buying">Buying</TabsTrigger>
        <TabsTrigger value="selling">Selling</TabsTrigger>
      </TabsList>

      <TabsContent value="buying">
        <div className="space-y-4">
          {buyerOrders?.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {order.listing.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Seller: {order.seller.username}</p>
                  <p>Amount: ₦{order.amount}</p>
                  <div className="flex gap-2">
                    {getPaymentStatusBadge(order.payment_status)}
                    {getDeliveryStatusBadge(order.delivery_status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {buyerOrders?.length === 0 && (
            <p className="text-center text-muted-foreground">No orders found</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="selling">
        <div className="space-y-4">
          {sellerOrders?.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {order.listing.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Buyer: {order.buyer.username}</p>
                  <p>Amount: ₦{order.amount}</p>
                  <div className="flex gap-2">
                    {getPaymentStatusBadge(order.payment_status)}
                    {getDeliveryStatusBadge(order.delivery_status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {sellerOrders?.length === 0 && (
            <p className="text-center text-muted-foreground">No orders found</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};