import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateListingForm } from "./CreateListingForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const MarketplaceListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: listings, isLoading } = useQuery({
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
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search listings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Phones & Tablets">Phones & Tablets</SelectItem>
            <SelectItem value="Computers">Computers</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
            <SelectItem value="Gaming">Gaming</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        
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

      {isLoading ? (
        <div>Loading...</div>
      ) : listings?.length === 0 ? (
        <div>No listings found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings?.map((listing) => (
            <div key={listing.id} className="border rounded-lg p-4">
              {listing.images && listing.images[0] && (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
              <p className="mt-2 font-bold">₦{listing.price.toLocaleString()}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Location: {listing.location}</p>
                <p>Condition: {listing.condition}</p>
                <p>Seller: {listing.profiles?.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};