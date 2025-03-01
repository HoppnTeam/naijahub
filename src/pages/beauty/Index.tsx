import { Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Store, Users } from 'lucide-react';

// Lazy load the marketplace component
const BeautyMarketplace = lazy(() => import('@/components/beauty/BeautyMarketplace'));

const BeautyBusinessHub = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Beauty Business Hub</h1>

      <Tabs defaultValue="marketplace" className="space-y-8">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="marketplace">
            <Store className="w-4 h-4 mr-2" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="directory">
            <Users className="w-4 h-4 mr-2" />
            Professional Directory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          <Suspense fallback={
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
            </div>
          }>
            <BeautyMarketplace />
          </Suspense>
        </TabsContent>

        <TabsContent value="directory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Directory</CardTitle>
                <CardDescription>
                  Browse and connect with beauty professionals.
                </CardDescription>
                <Button className="mt-4">View Professionals</Button>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Register as Professional</CardTitle>
                <CardDescription>
                  Create your professional profile and reach more clients.
                </CardDescription>
                <Button className="mt-4">Register Now</Button>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BeautyBusinessHub;
