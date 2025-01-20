import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface MarketplaceListItemProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    condition: string;
    location: string;
    profiles?: { username: string };
  };
}

export const MarketplaceListItem = ({ listing }: MarketplaceListItemProps) => {
  return (
    <Card className="h-full">
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
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {listing.description}
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Location: {listing.location}</p>
            <p>Condition: {listing.condition}</p>
            {listing.profiles?.username && (
              <p>Seller: {listing.profiles.username}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};