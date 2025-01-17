import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketplaceOrders } from "@/hooks/use-marketplace-orders";
import { OrdersListContent } from "./OrdersListContent";

export const OrdersList = () => {
  const { user } = useAuth();
  const { techOrders, autoOrders, isLoading } = useMarketplaceOrders();

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  const allOrders = [
    ...(techOrders || []),
    ...(autoOrders || []),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="tech">Tech Marketplace</TabsTrigger>
        <TabsTrigger value="auto">Auto Marketplace</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-6">
        <OrdersListContent 
          orders={allOrders} 
          marketplace="Combined" 
          userId={user?.id || ""}
        />
      </TabsContent>

      <TabsContent value="tech" className="space-y-6">
        <OrdersListContent 
          orders={techOrders || []} 
          marketplace="Tech" 
          userId={user?.id || ""}
        />
      </TabsContent>

      <TabsContent value="auto" className="space-y-6">
        <OrdersListContent 
          orders={autoOrders || []} 
          marketplace="Auto" 
          userId={user?.id || ""}
        />
      </TabsContent>
    </Tabs>
  );
};