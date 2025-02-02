import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ListingForm } from "./form/ListingForm";
import { MessageSquare } from "lucide-react";
import { PostActions } from "../PostActions";

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

  const ListingCard = ({ listing, marketplace }: { listing: any; marketplace: "tech" | "auto" }) => {
    const likesCount = listing[`${marketplace}_marketplace_likes`]?.[0]?.count || 0;
    const unreadMessages = listing.marketplace_chats?.reduce((acc: number, chat: any) => {
      const unreadCount = chat.marketplace_messages?.filter(
        (msg: any) => msg.sender_id !== userId && !msg.read_at
      ).length;
      return acc + (unreadCount || 0);
    }, 0);

    return (
      <Card key={listing.id}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {marketplace === "tech" ? "Tech" : "Auto"} Marketplace
              </div>
            </div>
            <Badge>{listing.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square w-24 rounded-lg overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="font-semibold">{formatCurrency(listing.price)}</div>
            </div>
          </div>

          <PostActions
            likesCount={likesCount}
            commentsCount={unreadMessages}
            isLiked={false}
            onLike={() => {}}
          />

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setEditingListing({ ...listing, marketplace });
              }}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedListingId(listing.id);
                setShowChatDialog(true);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages {unreadMessages > 0 && <Badge variant="destructive">{unreadMessages}</Badge>}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your listing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(listing.id, marketplace)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Tabs defaultValue="tech" className="w-full">
        <TabsList>
          <TabsTrigger value="tech">Tech Listings</TabsTrigger>
          <TabsTrigger value="auto">Auto Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="tech" className="space-y-4">
          {!techListings?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No tech listings found
            </div>
          ) : (
            techListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} marketplace="tech" />
            ))
          )}
        </TabsContent>

        <TabsContent value="auto" className="space-y-4">
          {!autoListings?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No auto listings found
            </div>
          ) : (
            autoListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} marketplace="auto" />
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingListing} onOpenChange={(open) => !open && setEditingListing(null)}>
        <DialogContent className="max-w-3xl">
          {editingListing && (
            <ListingForm
              onSubmit={handleUpdate}
              isLoading={false}
              initialData={editingListing}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};