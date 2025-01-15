import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketplaceListingCard } from "./MarketplaceListingCard";
import { CreateListingForm } from "./CreateListingForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { OrdersList } from "./OrdersList";
import { useNavigate } from "react-router-dom";

export const MarketplaceListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  const { data: listings, isLoading } = useQuery({
    queryKey: ["marketplace-listings", searchQuery, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("tech_marketplace_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="Phones & Tablets">Phones & Tablets</SelectItem>
            <SelectItem value="Computers">Computers</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
            <SelectItem value="Gaming">Gaming</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <CreateListingForm />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[300px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings?.map((listing) => (
            <MarketplaceListingCard
              key={listing.id}
              listing={listing}
              onClick={() => navigate(`/categories/technology/marketplace/${listing.id}`)}
            />
          ))}
          {listings?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No listings found
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
        <OrdersList />
      </div>
    </div>
  );
};
