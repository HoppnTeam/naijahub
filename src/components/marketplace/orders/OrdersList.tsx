import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/lib/error-handling';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@/types/marketplace';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

export const OrdersList: React.FC = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Order[];
    },
    onError: (error) => {
      handleAsyncError(error, 'Failed to fetch orders');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-2">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-lg font-medium">Failed to load orders</h3>
            <p className="text-muted-foreground">
              There was an error loading your orders. Please try again later.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-3">
            <Package className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No orders yet</h3>
            <p className="text-muted-foreground">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button 
              variant="default" 
              onClick={() => window.location.href = '/marketplace'}
              className="mt-4"
            >
              Browse Marketplace
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'processing':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value={order.id}>
              <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                    <Badge className={getStatusColor(order.status)} variant="outline">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <AccordionTrigger className="h-8 w-8 p-0" />
                </div>
              </div>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Shipping Information</h4>
                      <p className="text-sm">{order.shipping_address}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Contact Information</h4>
                      <p className="text-sm">{order.contact_info.name}</p>
                      <p className="text-sm">{order.contact_info.email}</p>
                      <p className="text-sm">{order.contact_info.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Payment Method</h4>
                    <p className="text-sm capitalize">{order.payment_method}</p>
                  </div>
                  
                  {order.delivery_notes && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Delivery Notes</h4>
                      <p className="text-sm">{order.delivery_notes}</p>
                    </div>
                  )}
                  
                  <div className="pt-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      ))}
    </div>
  );
};
