import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const OrdersList = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
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
            username
          ),
          seller:seller_id (
            username
          )
        `)
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>No orders found</div>;
  }

  return (
    <div>
      {orders.map(order => (
        <div key={order.id} className="order-item">
          <h3>{order.listing.title}</h3>
          <p>Price: {order.listing.price}</p>
          <p>Buyer: {order.buyer.username}</p>
          <p>Seller: {order.seller.username}</p>
          <img src={order.listing.images[0]} alt={order.listing.title} />
        </div>
      ))}
    </div>
  );
};
