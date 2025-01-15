import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const OrdersList = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: buyerOrders, isLoading: buyerLoading } = useQuery({
    queryKey: ["buyer-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tech_marketplace_orders")
        .select(`
          *,
          listing:listing_id (
            title,
            price,
            images
          ),
          seller:seller_id (
            profiles!tech_marketplace_orders_seller_id_profiles_fkey (
              username
            )
          )
        `)
        .eq("buyer_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: sellerOrders, isLoading: sellerLoading } = useQuery({
    queryKey: ["seller-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tech_marketplace_orders")
        .select(`
          *,
          listing:listing_id (
            title,
            price,
            images
          ),
          buyer:buyer_id (
            profiles!tech_marketplace_orders_buyer_id_profiles_fkey (
              username
            )
          )
        `)
        .eq("seller_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const OrderCard = ({ order, isBuyerView = true }) => (
    <Card key={order.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{order.listing.title}</h3>
            <p className="text-gray-600">Price: ₦{order.listing.price}</p>
            {isBuyerView ? (
              <p className="text-sm text-gray-500">
                Seller: {order.seller.profiles.username}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Buyer: {order.buyer.profiles.username}
              </p>
            )}
          </div>
          {order.listing.images?.[0] && (
            <img 
              src={order.listing.images[0]} 
              alt={order.listing.title} 
              className="w-20 h-20 object-cover rounded-md"
            />
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Badge variant={order.payment_status === "paid" ? "success" : "secondary"}>
            {order.payment_status}
          </Badge>
          <Badge variant={order.delivery_status === "delivered" ? "success" : "secondary"}>
            {order.delivery_status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  if (buyerLoading || sellerLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="buying" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buying">Buying</TabsTrigger>
          <TabsTrigger value="selling">Selling</TabsTrigger>
        </TabsList>
        <TabsContent value="buying">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Items You're Buying</h2>
            {buyerOrders?.length === 0 ? (
              <p className="text-muted-foreground">No purchases yet</p>
            ) : (
              buyerOrders?.map((order) => (
                <OrderCard key={order.id} order={order} isBuyerView={true} />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="selling">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Items You're Selling</h2>
            {sellerOrders?.length === 0 ? (
              <p className="text-muted-foreground">No sales yet</p>
            ) : (
              sellerOrders?.map((order) => (
                <OrderCard key={order.id} order={order} isBuyerView={false} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};