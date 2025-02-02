import { Badge } from "@/components/ui/badge";
import { MapPin, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { WorkshopMap } from "@/components/workshops/WorkshopMap";

interface ListingInfoProps {
  title: string;
  price: number;
  condition: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

export const ListingInfo = ({ 
  title,
  price,
  condition,
  description,
  location,
  latitude,
  longitude
}: ListingInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary">
          {formatCurrency(price)}
        </h3>
        <Badge variant="secondary">{condition}</Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="w-4 h-4" />
          <span>Condition: {condition}</span>
        </div>
      </div>

      <div className="prose prose-sm max-w-none">
        <h4 className="text-lg font-semibold">Description</h4>
        <p>{description}</p>
      </div>

      {latitude && longitude && (
        <div className="h-[200px] w-full rounded-lg overflow-hidden">
          <WorkshopMap
            latitude={latitude}
            longitude={longitude}
          />
        </div>
      )}
    </div>
  );
};