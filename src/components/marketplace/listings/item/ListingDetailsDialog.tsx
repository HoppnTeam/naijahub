import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Mail } from "lucide-react";
import { WorkshopMap } from "@/components/workshops/WorkshopMap";

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
          <Carousel className="w-full">
            <CarouselContent>
              {listing.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`${listing.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-primary">
                {formatCurrency(listing.price)}
              </h3>
              <Badge variant="secondary">{listing.condition}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>Condition: {listing.condition}</span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <h4 className="text-lg font-semibold">Description</h4>
              <p>{listing.description}</p>
            </div>

            {listing.latitude && listing.longitude && (
              <div className="h-[200px] w-full rounded-lg overflow-hidden">
                <WorkshopMap
                  latitude={listing.latitude}
                  longitude={listing.longitude}
                />
              </div>
            )}

            {listing.seller && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Seller Information</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {listing.seller.username}
                  </p>
                  {listing.seller.email && (
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};