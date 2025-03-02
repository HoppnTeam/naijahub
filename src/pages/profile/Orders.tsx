import React from 'react';
import { OrdersList } from '@/components/marketplace/orders/OrdersList';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Truck, Clock } from 'lucide-react';

const Orders = () => {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              View and track all your orders from the NaijaHub marketplace
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>All Orders</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-1">
              <Truck className="h-4 w-4" />
              <span>Active</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <OrdersList />
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  This feature is coming soon. Check back later!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  This feature is coming soon. Check back later!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProfileLayout>
  );
};

export default Orders;
