import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useBeautyMarketplace = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all beauty marketplace listings
  const { data: beautyListings, isLoading, error, refetch } = useQuery({
    queryKey: ["beauty-marketplace"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beauty_marketplace_listings")
        .select(`
          *,
          seller:profiles!beauty_marketplace_listings_seller_id_fkey (
            username,
            avatar_url
          ),
          beauty_marketplace_likes (
            count
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch a single beauty marketplace listing by ID
  const useBeautyListing = (listingId: string) => {
    return useQuery({
      queryKey: ["beauty-listing", listingId],
      queryFn: async () => {
        if (!listingId) return null;

        const { data, error } = await supabase
          .from("beauty_marketplace_listings")
          .select(`
            *,
            seller:profiles!beauty_marketplace_listings_seller_id_fkey (
              username,
              avatar_url,
              bio,
              location
            ),
            beauty_marketplace_likes (
              count
            )
          `)
          .eq("id", listingId)
          .single();

        if (error) throw error;
        return data;
      },
      enabled: !!listingId,
    });
  };

  // Create a new beauty marketplace listing
  const createListing = useMutation({
    mutationFn: async (listingData: any) => {
      if (!user) throw new Error("User must be logged in");

      const { data, error } = await supabase
        .from("beauty_marketplace_listings")
        .insert({
          ...listingData,
          seller_id: user.id,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beauty-marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["beauty-listings", user?.id] });
      toast({
        title: "Success",
        description: "Your beauty product listing has been created",
      });
    },
    onError: (error) => {
      console.error("Error creating beauty listing:", error);
      toast({
        title: "Error",
        description: "Failed to create your beauty product listing",
        variant: "destructive",
      });
    },
  });

  // Update an existing beauty marketplace listing
  const updateListing = useMutation({
    mutationFn: async ({ id, ...listingData }: { id: string; [key: string]: any }) => {
      if (!user) throw new Error("User must be logged in");

      const { data, error } = await supabase
        .from("beauty_marketplace_listings")
        .update(listingData)
        .eq("id", id)
        .eq("seller_id", user.id) // Ensure the user owns the listing
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["beauty-marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["beauty-listing", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["beauty-listings", user?.id] });
      toast({
        title: "Success",
        description: "Your beauty product listing has been updated",
      });
    },
    onError: (error) => {
      console.error("Error updating beauty listing:", error);
      toast({
        title: "Error",
        description: "Failed to update your beauty product listing",
        variant: "destructive",
      });
    },
  });

  // Delete a beauty marketplace listing
  const deleteListing = useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error("User must be logged in");

      const { error } = await supabase
        .from("beauty_marketplace_listings")
        .delete()
        .eq("id", listingId)
        .eq("seller_id", user.id); // Ensure the user owns the listing

      if (error) throw error;
      return listingId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beauty-marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["beauty-listings", user?.id] });
      toast({
        title: "Success",
        description: "Your beauty product listing has been deleted",
      });
    },
    onError: (error) => {
      console.error("Error deleting beauty listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete your beauty product listing",
        variant: "destructive",
      });
    },
  });

  // Like or unlike a beauty marketplace listing
  const toggleLike = useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error("User must be logged in");

      // Check if the user has already liked the listing
      const { data: existingLike, error: checkError } = await supabase
        .from("beauty_marketplace_likes")
        .select("*")
        .eq("listing_id", listingId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLike) {
        // Unlike the listing
        const { error: unlikeError } = await supabase
          .from("beauty_marketplace_likes")
          .delete()
          .eq("listing_id", listingId)
          .eq("user_id", user.id);

        if (unlikeError) throw unlikeError;
        return { action: "unliked", listingId };
      } else {
        // Like the listing
        const { error: likeError } = await supabase
          .from("beauty_marketplace_likes")
          .insert({
            listing_id: listingId,
            user_id: user.id,
          });

        if (likeError) throw likeError;
        return { action: "liked", listingId };
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["beauty-marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["beauty-listing", variables] });
    },
    onError: (error) => {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to like/unlike the listing",
        variant: "destructive",
      });
    },
  });

  return {
    beautyListings,
    isLoading,
    error,
    refetch,
    useBeautyListing,
    createListing,
    updateListing,
    deleteListing,
    toggleLike,
  };
};
