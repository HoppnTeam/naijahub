import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { SearchFilters } from "../SearchFilters";

type VehicleType = Database["public"]["Enums"]["vehicle_type"];

export const useListingsQuery = (searchQuery: string, filters: SearchFilters) => {
  return useQuery({
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
        query = query.eq("vehicle_type", filters.vehicleType as VehicleType);
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
};