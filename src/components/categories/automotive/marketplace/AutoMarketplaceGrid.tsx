import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { AutoListingCard } from "./AutoListingCard";

interface AutoMarketplaceGridProps {
  listings: any[];
  isLoading: boolean;
}

export const AutoMarketplaceGrid = ({ listings, isLoading }: AutoMarketplaceGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listings?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-lg font-semibold text-center">No listings found</p>
          <p className="text-muted-foreground text-center">
            Try adjusting your filters or be the first to create a listing
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <AutoListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};