import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CommentsList } from "@/components/CommentsList";
import { ListingHeader } from "./listing-details/ListingHeader";
import { ListingDetails } from "./listing-details/ListingDetails";
import { ContactButton } from "./listing-details/ContactButton";

export const ListingDetailsView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["auto_listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_marketplace_listings")
        .select(`
          *,
          profiles!auto_marketplace_listings_seller_id_profiles_fkey (
            username,
            avatar_url
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["listing_comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_marketplace_comments")
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq("listing_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleContact = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to contact sellers",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Coming soon",
      description: "Contact functionality will be available soon",
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Listing not found</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <ListingHeader
            title={listing.title}
            price={listing.price}
            seller={listing.profiles}
            created_at={listing.created_at}
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listing.images?.[0] && (
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-4">
              <ListingDetails
                condition={listing.condition}
                location={listing.location}
                created_at={listing.created_at}
                make={listing.make}
                model={listing.model}
                year={listing.year}
                mileage={listing.mileage}
                section={listing.section}
                description={listing.description}
              />
              <ContactButton
                isOwner={user?.id === listing.seller_id}
                isBusiness={listing.is_business}
                onContact={handleContact}
              />
            </div>
          </div>
          <CommentsList comments={comments} />
        </CardContent>
      </Card>
    </div>
  );
};