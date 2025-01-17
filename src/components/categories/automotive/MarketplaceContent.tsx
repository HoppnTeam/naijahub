import { useState } from "react";
import { useParams } from "react-router-dom";
import { ListingDetailsView } from "./ListingDetailsView";
import { CreateListingView } from "./views/CreateListingView";
import { MarketplaceLayout } from "./marketplace/MarketplaceLayout";
import { MarketplaceListingsView } from "./marketplace/MarketplaceListingsView";
import { useListingsQuery } from "./hooks/useListingsQuery";
import type { SearchFilters as SearchFiltersType } from "./SearchFilters";

interface MarketplaceContentProps {
  searchQuery: string;
}

export const MarketplaceContent = ({ searchQuery }: MarketplaceContentProps) => {
  const { listingId } = useParams();
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: listingsData } = useListingsQuery(searchQuery, filters);

  // Render content based on current view
  if (listingId) {
    return <ListingDetailsView />;
  }

  if (showCreateForm) {
    return <CreateListingView onBack={() => setShowCreateForm(false)} />;
  }

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