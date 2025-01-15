import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const OrdersList = () => {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("tech_marketplace_orders")
        .select(`
          *,
          listing:listing_id (
            title,
            images
          ),
          buyer:buyer_id (
            username
          ),
          seller:seller_id (
            username
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orders found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{order.listing.title}</CardTitle>
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
                  {user?.id === order.buyer_id ? "Seller" : "Buyer"}
                </div>
                <div className="font-semibold">
                  {user?.id === order.buyer_id ? order.seller.username : order.buyer.username}
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