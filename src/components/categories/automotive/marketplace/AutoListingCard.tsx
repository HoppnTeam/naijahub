import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Car } from "lucide-react";

interface AutoListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    vehicle_type: string;
    condition: string;
    location: string;
    images: string[];
    created_at: string;
    make?: string;
    model?: string;
    year?: number;
    profiles: {
      username: string;
    };
  };
}

export const AutoListingCard = ({ listing }: AutoListingCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={listing.images[0] || "/placeholder.svg"}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2 text-lg">{listing.title}</CardTitle>
          <Badge>{listing.vehicle_type}</Badge>
        </div>
        <div className="text-2xl font-bold text-primary">
          ₦{listing.price.toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {listing.make && listing.model && listing.year && (
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-4 h-4" />
              <span>
                {listing.year} {listing.make} {listing.model}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Posted by {listing.profiles.username}</span>
          </div>
          <Badge variant="secondary">{listing.condition}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};