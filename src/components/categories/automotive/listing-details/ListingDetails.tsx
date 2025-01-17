import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ListingDetailsProps {
  condition: string;
  location: string;
  created_at: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  section: string;
  description: string;
}

export const ListingDetails = ({
  condition,
  location,
  created_at,
  make,
  model,
  year,
  mileage,
  section,
  description,
}: ListingDetailsProps) => {
  return (
    <div className="space-y-4">
      <Badge variant="secondary">{condition}</Badge>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date(created_at).toLocaleDateString()}</span>
        </div>
        {section === "vehicles" && (
          <>
            {make && model && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>
                  {make} {model} {year && `(${year})`}
                </span>
              </div>
            )}
            {mileage && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>{mileage.toLocaleString()} km</span>
              </div>
            )}
          </>
        )}
      </div>
      <div className="prose max-w-none">
        <h3>Description</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};