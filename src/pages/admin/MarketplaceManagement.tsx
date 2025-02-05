import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingsManagement } from "@/components/marketplace/ListingsManagement";
import { useProfile } from "@/hooks/useProfile";

export const MarketplaceManagement = () => {
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Marketplace Management</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Listings Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tech" className="w-full">
              <TabsList>
                <TabsTrigger value="tech">Tech Marketplace</TabsTrigger>
                <TabsTrigger value="auto">Auto Marketplace</TabsTrigger>
              </TabsList>

              <TabsContent value="tech">
                <ListingsManagement userId={profile.user_id} />
              </TabsContent>

              <TabsContent value="auto">
                <ListingsManagement userId={profile.user_id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};