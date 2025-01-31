import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateListingForm } from "./CreateListingForm";
import { MarketplaceFilters } from "./listings/MarketplaceFilters";
import { MarketplaceList } from "./listings/MarketplaceList";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const MarketplaceListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ["marketplace-listings", selectedCategory, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("tech_marketplace_listings")
        .select("*, profiles(username)")
        .eq("status", "active");

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: likedListings } = useQuery({
    queryKey: ["liked-listings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tech_marketplace_likes')
        .select('listing_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(like => like.listing_id);
    },
    enabled: !!user,
  });

  const handleCreateClick = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to create a listing",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <MarketplaceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick}>Create Listing</Button>
          </DialogTrigger>
          {user && (
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <CreateListingForm />
            </DialogContent>
          )}
        </Dialog>
      </div>

      <MarketplaceList 
        listings={listings} 
        isLoading={isLoading}
        likedListings={likedListings}
        onLikeToggle={refetch}
      />
    </div>
  );
};