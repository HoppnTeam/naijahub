import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingLoadingSkeleton } from "./listing-details/ListingLoadingSkeleton";
import { ListingContent } from "./listing-details/ListingContent";

export const ListingDetailsView = () => {
  const { id } = useParams();

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

  if (isLoading) {
    return <ListingLoadingSkeleton />;
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
      <ListingContent listing={listing} comments={comments} />
    </div>
  );
};