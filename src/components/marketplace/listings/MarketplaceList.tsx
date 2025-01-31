import { MarketplaceListItem } from "./MarketplaceListItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MarketplaceListProps {
  listings: any[];
  isLoading: boolean;
}

export const MarketplaceList = ({ listings, isLoading }: MarketplaceListProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!listings?.length) {
    return <div>No listings found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <MarketplaceListItem key={listing.id} listing={listing} />
      ))}
    </div>
  );
};