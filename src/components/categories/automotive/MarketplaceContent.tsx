import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsList } from "./PostsList";
import { ListingDetailsView } from "./ListingDetailsView";
import { useParams } from "react-router-dom";
import { SearchFilters, type SearchFilters as SearchFiltersType } from "./SearchFilters";
import { useState } from "react";

interface MarketplaceContentProps {
  searchQuery: string;
}

export const MarketplaceContent = ({ searchQuery }: MarketplaceContentProps) => {
  const { listingId } = useParams();
  const [filters, setFilters] = useState<SearchFiltersType>({});

  // If we have a listingId, show the details view
  if (listingId) {
    return <ListingDetailsView />;
  }

  const { data: listingsData } = useQuery({
    queryKey: ["auto_marketplace", searchQuery, filters],
    queryFn: async () => {
      let query = supabase
        .from("auto_marketplace_listings")
        .select(`
          *,
          profiles!auto_marketplace_listings_seller_id_profiles_fkey (username, avatar_url)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      // Apply text search
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply filters
      if (filters.minPrice) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte("price", filters.maxPrice);
      }
      if (filters.condition) {
        query = query.eq("condition", filters.condition);
      }
      if (filters.vehicleType) {
        query = query.eq("vehicle_type", filters.vehicleType);
      }
      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters.make) {
        query = query.ilike("make", `%${filters.make}%`);
      }
      if (filters.transmission) {
        query = query.eq("transmission", filters.transmission);
      }
      if (filters.fuelType) {
        query = query.eq("fuel_type", filters.fuelType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <SearchFilters onFiltersChange={setFilters} />
      </div>
      
      <div className="lg:col-span-3">
        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="parts">Parts</TabsTrigger>
          </TabsList>
          <TabsContent value="vehicles">
            <PostsList 
              listings={listingsData?.filter(l => l.section === 'vehicles')} 
              searchQuery={searchQuery}
              section="vehicles"
            />
          </TabsContent>
          <TabsContent value="parts">
            <PostsList 
              listings={listingsData?.filter(l => l.section === 'parts')} 
              searchQuery={searchQuery}
              section="parts"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};