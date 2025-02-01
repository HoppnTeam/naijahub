import { MarketplaceListItem } from "./MarketplaceListItem";
import { BrowserRouter as Router } from "react-router-dom";

interface MarketplaceListProps {
  listings: any[];
  isLoading: boolean;
  likedListings?: string[];
  onLikeToggle?: () => void;
}

export const MarketplaceList = ({ 
  listings, 
  isLoading,
  likedListings = [],
  onLikeToggle 
}: MarketplaceListProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <MarketplaceListItem
          key={listing.id}
          listing={listing}
          isLiked={likedListings.includes(listing.id)}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </div>
  );
};