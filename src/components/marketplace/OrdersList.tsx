import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketplaceOrders } from "@/hooks/use-marketplace-orders";
import { OrdersListContent } from "./OrdersListContent";
import { ListingsManagement } from "./ListingsManagement";

export const OrdersList = () => {
  const { user } = useAuth();
  const { techOrders, autoOrders, beautyOrders, isLoading } = useMarketplaceOrders();

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  const allOrders = [
    ...(techOrders || []),
    ...(autoOrders || []),
    ...(beautyOrders || []),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="tech">Tech Orders</TabsTrigger>
        <TabsTrigger value="auto">Auto Orders</TabsTrigger>
        <TabsTrigger value="beauty">Beauty Orders</TabsTrigger>
        <TabsTrigger value="listings">My Listings</TabsTrigger>
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

      <TabsContent value="beauty" className="space-y-6">
        <OrdersListContent 
          orders={beautyOrders || []} 
          marketplace="Beauty" 
          userId={user?.id || ""}
        />
      </TabsContent>

      <TabsContent value="listings" className="space-y-6">
        <ListingsManagement userId={user?.id || ""} />
      </TabsContent>
    </Tabs>
  );
};