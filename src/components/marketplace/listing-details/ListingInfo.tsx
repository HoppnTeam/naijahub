import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Clock, User } from "lucide-react";

interface ListingInfoProps {
  listing: any;
}

export const ListingInfo = ({ listing }: ListingInfoProps) => {
  return (
    <div className="space-y-4">
      <Badge variant="secondary">{listing.condition}</Badge>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{listing.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{new Date(listing.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{listing.seller?.username}</span>
        </div>
      </div>
      <div className="prose max-w-none">
        <h3>Description</h3>
        <p>{listing.description}</p>
      </div>
    </div>
  );
};