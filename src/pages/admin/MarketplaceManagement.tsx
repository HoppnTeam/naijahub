import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingsManagement } from "@/components/marketplace/ListingsManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const MarketplaceManagement = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });

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
              <TabsList className="mb-4">
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