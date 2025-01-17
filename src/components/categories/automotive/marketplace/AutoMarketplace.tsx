import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AutoMarketplaceMap } from "./AutoMarketplaceMap";
import { AutoMarketplaceGrid } from "./AutoMarketplaceGrid";
import { AutoMarketplaceFilters } from "./AutoMarketplaceFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateListingForm } from "./CreateListingForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const AutoMarketplace = () => {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [filters, setFilters] = useState({
    vehicleType: "all",
    priceRange: [0, 1000000],
    distance: 50,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: listings, isLoading } = useQuery({
    queryKey: ["auto-marketplace-listings", filters],
    queryFn: async () => {
      let query = supabase
        .from("auto_marketplace_listings")
        .select("*, profiles!auto_marketplace_listings_seller_id_fkey(username)")
        .eq("status", "active");

      if (filters.vehicleType !== "all") {
        query = query.eq("vehicle_type", filters.vehicleType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleCreateClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a listing",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Auto Marketplace</h2>
        <div className="flex items-center gap-4">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
          >
            Grid View
          </Button>
          <Button
            variant={view === "map" ? "default" : "outline"}
            onClick={() => setView("map")}
          >
            Map View
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleCreateClick}>
                <Plus className="w-4 h-4 mr-2" />
                Create Listing
              </Button>
            </DialogTrigger>
            {user && (
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <CreateListingForm />
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>

      <AutoMarketplaceFilters filters={filters} onFiltersChange={setFilters} />

      {view === "grid" ? (
        <AutoMarketplaceGrid listings={listings} isLoading={isLoading} />
      ) : (
        <AutoMarketplaceMap listings={listings} isLoading={isLoading} />
      )}
    </div>
  );
};