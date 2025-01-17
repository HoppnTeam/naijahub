import { OrderCard } from "./OrderCard";

interface OrdersListContentProps {
  orders: any[];
  marketplace: string;
  userId: string;
}

export const OrdersListContent = ({ orders, marketplace, userId }: OrdersListContentProps) => {
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
        <OrderCard 
          key={order.id} 
          order={order} 
          marketplace={marketplace}
          userId={userId}
        />
      ))}
    </div>
  );
};