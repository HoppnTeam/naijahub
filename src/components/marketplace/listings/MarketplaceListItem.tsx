import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { WorkshopMap } from "@/components/workshops/WorkshopMap";
import { LikeButton } from "./item/LikeButton";
import { ListingImage } from "./item/ListingImage";
import { ListingDetails } from "./item/ListingDetails";

interface MarketplaceListItemProps {
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
    profiles?: { username: string };
  };
}

export const MarketplaceListItem = ({ listing }: MarketplaceListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/marketplace/${listing.id}`);
  };

  return (
    <Card className="h-full relative group" onClick={handleClick}>
      {listing.images && listing.images[0] && (
        <ListingImage 
          imageUrl={listing.images[0]} 
          title={listing.title} 
        />
      )}
      
      <CardHeader className="space-y-2">
        <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(listing.price)}
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <ListingDetails 
            title={listing.title}
            description={listing.description}
            price={listing.price}
            condition={listing.condition}
            location={listing.location}
            sellerUsername={listing.profiles?.username}
          />
          
          {listing.latitude && listing.longitude && (
            <div className="h-48 w-full rounded-lg overflow-hidden">
              <WorkshopMap 
                latitude={listing.latitude}
                longitude={listing.longitude}
              />
            </div>
          )}

          <LikeButton listingId={listing.id} />
        </div>
      </CardContent>
    </Card>
  );
};