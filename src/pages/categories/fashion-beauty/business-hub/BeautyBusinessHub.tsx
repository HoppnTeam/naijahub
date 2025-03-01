import { Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components
const BeautyMarketplace = lazy(() => import('@/components/beauty/BeautyMarketplace').then(module => ({ default: module.BeautyMarketplace })));
const ProfessionalDirectory = lazy(() => import('@/components/beauty/ProfessionalDirectory'));

const BeautyBusinessHub = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Beauty Business Hub</h1>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="w-full bg-[#f1f5f9] mb-6">
          <TabsTrigger 
            value="directory"
            className="flex-1 data-[state=active]:bg-white"
          >
            Professional Directory
          </TabsTrigger>
          <TabsTrigger 
            value="marketplace"
            className="flex-1 data-[state=active]:bg-white"
          >
            Beauty Products Marketplace
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <ProfessionalDirectory />
          </Suspense>
        </TabsContent>

        <TabsContent value="marketplace">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <BeautyMarketplace />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BeautyBusinessHub;
