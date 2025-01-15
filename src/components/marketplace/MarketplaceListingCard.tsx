import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Package, MapPin, Clock } from "lucide-react";

interface MarketplaceListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    condition: string;
    location: string;
    images: string[];
    created_at: string;
  };
  onClick: () => void;
}

export const MarketplaceListingCard = ({ listing, onClick }: MarketplaceListingCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={listing.images[0] || "/placeholder.svg"}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{listing.title}</CardTitle>
        <div className="text-2xl font-bold text-primary">
          {formatCurrency(listing.price)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Badge variant="secondary">{listing.condition}</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{new Date(listing.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};