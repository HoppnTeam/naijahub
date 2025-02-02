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
import { MapPin, Package, Mail, ShoppingCart, Info } from "lucide-react";
import { WorkshopMap } from "@/components/workshops/WorkshopMap";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { toast } = useToast();

  const handleBuyNow = () => {
    // For now, show a toast until Paystack integration is implemented
    toast({
      title: "Coming Soon!",
      description: "Payment integration will be available soon.",
      variant: "default"
    });
  };

  const handleContactSeller = () => {
    if (!listing.seller?.email) {
      toast({
        title: "Contact Information Unavailable",
        description: "The seller's contact information is not available.",
        variant: "destructive"
      });
      return;
    }

    // For now, open email client
    window.location.href = `mailto:${listing.seller.email}?subject=Inquiry about: ${listing.title}`;
  };

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
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={handleBuyNow}
                      className="w-full sm:w-auto"
                    >
                      <ShoppingCart className="mr-2" />
                      Buy Now
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleContactSeller}
                      className="w-full sm:w-auto"
                    >
                      <Info className="mr-2" />
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};