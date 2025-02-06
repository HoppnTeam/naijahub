import { Card, CardContent } from "@/components/ui/card";
import { ListingTabs } from "@/components/marketplace/management";
import { MarketplacePagination } from "./MarketplacePagination";

interface MarketplaceContentProps {
  techListings: any[];
  autoListings: any[];
  onEdit: (listing: any) => void;
  onDelete: (id: string, marketplace: "tech" | "auto") => void;
  onChatOpen: (listingId: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  error?: Error | null;
}

export const MarketplaceContent = ({
  techListings,
  autoListings,
  onEdit,
  onDelete,
  onChatOpen,
  currentPage,
  onPageChange,
  error,
}: MarketplaceContentProps) => {
  return (
    <Card>
      <CardContent>
        <ListingTabs
          techListings={techListings || []}
          autoListings={autoListings || []}
          onEdit={onEdit}
          onDelete={onDelete}
          onChatOpen={onChatOpen}
        />

        {error && (
          <div className="p-4 text-red-500">
            Error loading listings. Please try again.
          </div>
        )}

        <MarketplacePagination
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  );
};