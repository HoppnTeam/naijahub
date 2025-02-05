import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import { ListingTabs } from "./management/ListingTabs";
import { ListingEditDialog } from "./management/ListingEditDialog";

interface ListingsManagementProps {
  userId: string;
}

export const ListingsManagement = ({ userId }: ListingsManagementProps) => {
  const [editingListing, setEditingListing] = useState<any>(null);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const { data: techListings, refetch: refetchTech } = useQuery({
    queryKey: ["tech-listings", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tech_marketplace_listings")
        .select(`
          *,
          tech_marketplace_likes (count),
          marketplace_chats (
            id,
            sender_id,
            marketplace_messages (
              id,
              content,
              created_at,
              sender_id,
              read_at
            )
          )
        `)
        .eq("seller_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: autoListings, refetch: refetchAuto } = useQuery({
    queryKey: ["auto-listings", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_marketplace_listings")
        .select(`
          *,
          auto_marketplace_likes (count),
          marketplace_chats (
            id,
            sender_id,
            marketplace_messages (
              id,
              content,
              created_at,
              sender_id,
              read_at
            )
          )
        `)
        .eq("seller_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const handleDelete = async (listingId: string, marketplace: "tech" | "auto") => {
    try {
      const { error } = await supabase
        .from(marketplace === "tech" ? "tech_marketplace_listings" : "auto_marketplace_listings")
        .delete()
        .eq("id", listingId);

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
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!editingListing) return;

    try {
      const { error } = await supabase
        .from(editingListing.marketplace === "tech" ? "tech_marketplace_listings" : "auto_marketplace_listings")
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          condition: formData.condition,
          category: formData.category,
          location: formData.location,
          payment_methods: formData.paymentMethods,
          delivery_method: formData.deliveryMethod,
          images: formData.selectedFiles,
        })
        .eq("id", editingListing.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing updated successfully",
      });

      setEditingListing(null);
      if (editingListing.marketplace === "tech") {
        refetchTech();
      } else {
        refetchAuto();
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ListingTabs
        techListings={techListings || []}
        autoListings={autoListings || []}
        onEdit={setEditingListing}
        onDelete={handleDelete}
        onChatOpen={(listingId) => {
          setSelectedListingId(listingId);
          setShowChatDialog(true);
        }}
      />

      <ListingEditDialog
        listing={editingListing}
        onClose={() => setEditingListing(null)}
        onUpdate={handleUpdate}
      />

      <Dialog 
        open={showChatDialog} 
        onOpenChange={setShowChatDialog}
      >
        {/* Chat dialog content will be implemented later */}
      </Dialog>
    </>
  );
};
