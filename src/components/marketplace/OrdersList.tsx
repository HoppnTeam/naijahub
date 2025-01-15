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
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">{order.listing.title}</h3>
          <p className="text-gray-600">Price: ₦{order.listing.price}</p>
          <p className="text-sm text-gray-500">Buyer: {order.buyer.username}</p>
          <p className="text-sm text-gray-500">Seller: {order.seller.username}</p>
          {order.listing.images?.[0] && (
            <img 
              src={order.listing.images[0]} 
              alt={order.listing.title} 
              className="mt-2 w-32 h-32 object-cover rounded-md"
            />
          )}
          <div className="mt-2">
            <p className="text-sm">Payment Status: <span className="font-medium">{order.payment_status}</span></p>
            <p className="text-sm">Delivery Status: <span className="font-medium">{order.delivery_status}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
};