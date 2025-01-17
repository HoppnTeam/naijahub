import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SearchFilters } from "../SearchFilters";
import type { SearchFilters as SearchFiltersType } from "../SearchFilters";

interface MarketplaceLayoutProps {
  onCreateListing: () => void;
  onFiltersChange: (filters: SearchFiltersType) => void;
  children: React.ReactNode;
}

export const MarketplaceLayout = ({
  onCreateListing,
  onFiltersChange,
  children,
}: MarketplaceLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="mb-4">
          <Button onClick={onCreateListing} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </div>
        <SearchFilters onFiltersChange={onFiltersChange} />
      </div>
      <div className="lg:col-span-3">
        {children}
      </div>
    </div>
  );
};