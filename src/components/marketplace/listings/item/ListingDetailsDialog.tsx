import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListingImageCarousel } from "./ListingImageCarousel";
import { ListingInfo } from "./ListingInfo";
import { SellerActions } from "./SellerActions";

interface ListingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    condition: string;
    location: string;
    latitude?: number;
    longitude?: number;
    seller?: {
      username?: string;
      email?: string;
    };
  };
}

export const ListingDetailsDialog = ({
  open,
  onOpenChange,
  listing
}: ListingDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{listing.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ListingImageCarousel 
            images={listing.images} 
            title={listing.title} 
          />

          <ListingInfo
            title={listing.title}
            price={listing.price}
            condition={listing.condition}
            description={listing.description}
            location={listing.location}
            latitude={listing.latitude}
            longitude={listing.longitude}
          />

          {listing.seller && (
            <SellerActions 
              seller={listing.seller}
              title={listing.title}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};