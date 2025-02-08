
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateListingForm } from "./CreateListingForm";
import { MarketplaceFilters } from "./listings/MarketplaceFilters";
import { MarketplaceList } from "./listings/MarketplaceList";
import { ShoppingCart } from "./cart/ShoppingCart";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart as CartIcon } from "lucide-react";
import { useShoppingCart } from "@/hooks/use-shopping-cart";

export const MarketplaceListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { cartItemsCount } = useShoppingCart();

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

  const handleLikeToggle = async () => {
    await refetch();
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
        
        <div className="flex gap-2">
          <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <CartIcon className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <ShoppingCart />
            </DialogContent>
          </Dialog>

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
      </div>

      <MarketplaceList 
        listings={listings} 
        isLoading={isLoading}
        likedListings={likedListings}
        onLikeToggle={handleLikeToggle}
      />
    </div>
  );
};
