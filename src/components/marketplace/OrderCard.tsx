import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface OrderCardProps {
  order: any;
  marketplace: string;
  userId: string;
}

export const OrderCard = ({ order, marketplace, userId }: OrderCardProps) => {
  return (
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
              {userId === order.buyer.user_id ? "Seller" : "Buyer"}
            </div>
            <div className="font-semibold">
              {userId === order.buyer.user_id ? order.seller.username : order.buyer.username}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="font-semibold">{order.delivery_status}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};