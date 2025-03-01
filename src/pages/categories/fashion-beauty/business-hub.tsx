import { Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Store, Users } from 'lucide-react';

// Lazy load the marketplace component for better performance
const BeautyMarketplace = lazy(() => import('@/components/beauty/BeautyMarketplace'));

const BeautyBusinessHub = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Beauty Business Hub</h1>

      <Tabs defaultValue="directory" className="space-y-8">
        <TabsList>
          <TabsTrigger value="directory">Professional Directory</TabsTrigger>
          <TabsTrigger value="marketplace">Beauty Products</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Directory</CardTitle>
                <CardDescription>
                  Browse and connect with beauty professionals.
                </CardDescription>
                <Button 
                  variant="default" 
                  className="mt-4 bg-[#32a852] hover:bg-[#32a852]/90 text-white"
                >
                  View Professionals
                </Button>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Register as Professional</CardTitle>
                <CardDescription>
                  Create your professional profile and reach more clients.
                </CardDescription>
                <Button 
                  variant="default" 
                  className="mt-4 bg-[#32a852] hover:bg-[#32a852]/90 text-white"
                >
                  Register Now
                </Button>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace">
          <Suspense fallback={
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
              </div>
            </div>
          }>
            <BeautyMarketplace />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BeautyBusinessHub;
