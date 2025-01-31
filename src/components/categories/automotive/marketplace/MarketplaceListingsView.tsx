import { MarketplaceList } from "@/components/marketplace/listings/MarketplaceList";

interface MarketplaceListingsViewProps {
  listingsData: any[];
  searchQuery: string;
}

export const MarketplaceListingsView = ({ 
  listingsData,
  searchQuery,
}: MarketplaceListingsViewProps) => {
  return (
    <div className="space-y-6">
      <MarketplaceList 
        listings={listingsData || []}
        isLoading={false}
      />
    </div>
  );
};