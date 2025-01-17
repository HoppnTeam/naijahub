import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateListingForm } from "./forms/CreateListingForm";
import { ListingDetailsView } from "./ListingDetailsView";
import { MarketplaceLayout } from "./marketplace/MarketplaceLayout";
import { MarketplaceListingsView } from "./marketplace/MarketplaceListingsView";
import type { SearchFilters as SearchFiltersType } from "./SearchFilters";

interface MarketplaceContentProps {
  searchQuery: string;
}

export const MarketplaceContent = ({ searchQuery }: MarketplaceContentProps) => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [showCreateForm, setShowCreateForm] = useState(false);

  // If we have a listingId, show the details view
  if (listingId) {
    return <ListingDetailsView />;
  }

  // If we're showing the create form
  if (showCreateForm) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="outline" 
          onClick={() => setShowCreateForm(false)}
          className="mb-6"
        >
          Back to Listings
        </Button>
        <CreateListingForm />
      </div>
    );
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
    <MarketplaceLayout
      onCreateListing={() => setShowCreateForm(true)}
      onFiltersChange={setFilters}
    >
      <MarketplaceListingsView 
        listingsData={listingsData}
        searchQuery={searchQuery}
      />
    </MarketplaceLayout>
  );
};