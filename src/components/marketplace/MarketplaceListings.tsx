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

export const MarketplaceListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: listings, isLoading } = useQuery({
    queryKey: ["marketplace-listings", selectedCategory, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("tech_marketplace_listings")
        .select("*")
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
            <SelectItem value="laptops">Laptops</SelectItem>
            <SelectItem value="phones">Phones</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
        <Button>Create Listing</Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : listings?.length === 0 ? (
        <div>No listings found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings?.map((listing) => (
            <div key={listing.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-sm text-muted-foreground">{listing.description}</p>
              <p className="mt-2 font-bold">₦{listing.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};