import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingTabs } from "@/components/marketplace/management";
import { useState } from "react";
import { ListingEditDialog } from "@/components/marketplace/management";
import { useToast } from "@/hooks/use-toast";

export const MarketplaceManagement = () => {
  const [editingListing, setEditingListing] = useState<any>(null);
  const { toast } = useToast();

  const { data: techListings, refetch: refetchTech } = useQuery({
    queryKey: ['admin-tech-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tech_marketplace_listings')
        .select(`
          *,
          profiles!tech_marketplace_listings_seller_id_profiles_fkey (username, avatar_url),
          marketplace_chats (
            marketplace_messages (
              read_at
            )
          ),
          tech_marketplace_likes (
            count
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: autoListings, refetch: refetchAuto } = useQuery({
    queryKey: ['admin-auto-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auto_marketplace_listings')
        .select(`
          *,
          profiles!auto_marketplace_listings_seller_id_profiles_fkey (username, avatar_url),
          marketplace_chats (
            marketplace_messages (
              read_at
            )
          ),
          auto_marketplace_likes (
            count
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const handleEdit = (listing: any) => {
    setEditingListing(listing);
  };

  const handleDelete = async (id: string, marketplace: "tech" | "auto") => {
    try {
      const table = marketplace === "tech" ? "tech_marketplace_listings" : "auto_marketplace_listings";
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });

      if (marketplace === "tech") {
        refetchTech();
      } else {
        refetchAuto();
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete listing",
      });
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      const table = formData.marketplace === "tech" ? "tech_marketplace_listings" : "auto_marketplace_listings";
      const { error } = await supabase
        .from(table)
        .update({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          status: formData.status,
        })
        .eq('id', formData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing updated successfully",
      });

      setEditingListing(null);
      if (formData.marketplace === "tech") {
        refetchTech();
      } else {
        refetchAuto();
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update listing",
      });
    }
  };

  const handleChatOpen = (listingId: string) => {
    // This will be implemented when we add chat functionality
    console.log("Opening chat for listing:", listingId);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Marketplace Management</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Listings Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ListingTabs
              techListings={techListings || []}
              autoListings={autoListings || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChatOpen={handleChatOpen}
            />
          </CardContent>
        </Card>

        <ListingEditDialog
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onUpdate={handleUpdate}
        />
      </div>
    </AdminLayout>
  );
};