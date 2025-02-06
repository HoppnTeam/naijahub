import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
}

const MetricCard = ({ title, value, icon, loading }: MetricCardProps) => (
  <Card className="p-4">
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-green-100 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        {loading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          <p className="text-2xl font-semibold">{value}</p>
        )}
      </div>
    </div>
  </Card>
);

export const MarketplaceMetrics = () => {
  const { data: techMetrics, isLoading: techLoading } = useQuery({
    queryKey: ['tech-marketplace-metrics'],
    queryFn: async () => {
      const { data: listings } = await supabase
        .from('tech_marketplace_listings')
        .select('price, status');
      
      const { data: orders } = await supabase
        .from('tech_marketplace_orders')
        .select('amount');

      const activeListings = listings?.filter(l => l.status === 'active').length || 0;
      const totalSales = orders?.reduce((sum, order) => sum + Number(order.amount), 0) || 0;
      const totalOrders = orders?.length || 0;

      return {
        activeListings,
        totalSales,
        totalOrders
      };
    }
  });

  const { data: autoMetrics, isLoading: autoLoading } = useQuery({
    queryKey: ['auto-marketplace-metrics'],
    queryFn: async () => {
      const { data: listings } = await supabase
        .from('auto_marketplace_listings')
        .select('price, status');
      
      const { data: orders } = await supabase
        .from('auto_marketplace_orders')
        .select('amount');

      const activeListings = listings?.filter(l => l.status === 'active').length || 0;
      const totalSales = orders?.reduce((sum, order) => sum + Number(order.amount), 0) || 0;
      const totalOrders = orders?.length || 0;

      return {
        activeListings,
        totalSales,
        totalOrders
      };
    }
  });

  const isLoading = techLoading || autoLoading;
  const totalActiveListings = (techMetrics?.activeListings || 0) + (autoMetrics?.activeListings || 0);
  const totalSales = (techMetrics?.totalSales || 0) + (autoMetrics?.totalSales || 0);
  const totalOrders = (techMetrics?.totalOrders || 0) + (autoMetrics?.totalOrders || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Active Listings"
        value={totalActiveListings}
        icon={<TrendingUp className="text-green-600" />}
        loading={isLoading}
      />
      <MetricCard
        title="Total Orders"
        value={totalOrders}
        icon={<ShoppingCart className="text-green-600" />}
        loading={isLoading}
      />
      <MetricCard
        title="Total Sales"
        value={`₦${totalSales.toLocaleString()}`}
        icon={<DollarSign className="text-green-600" />}
        loading={isLoading}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${totalOrders > 0 ? ((totalOrders / totalActiveListings) * 100).toFixed(1) : 0}%`}
        icon={<Users className="text-green-600" />}
        loading={isLoading}
      />
    </div>
  );
};