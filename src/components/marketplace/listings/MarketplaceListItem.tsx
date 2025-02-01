import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { WorkshopMap } from "@/components/workshops/WorkshopMap";
import { LikeButton } from "./item/LikeButton";

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
  isLiked?: boolean;
  onLikeToggle?: () => void;
}

export const MarketplaceListItem = ({ 
  listing,
  isLiked = false,
  onLikeToggle 
}: MarketplaceListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/marketplace/${listing.id}`);
  };

  return (
    <Card className="h-full relative group" onClick={handleClick}>
      {listing.images && listing.images[0] && (
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="space-y-2">
        <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(listing.price)}
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{listing.condition}</span>
              <span className="text-sm text-muted-foreground">{listing.location}</span>
            </div>
          </div>
          
          {listing.latitude && listing.longitude && (
            <div className="h-48 w-full rounded-lg overflow-hidden">
              <WorkshopMap 
                latitude={listing.latitude}
                longitude={listing.longitude}
              />
            </div>
          )}

          <LikeButton 
            listingId={listing.id} 
            isLiked={isLiked}
            onToggle={onLikeToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};