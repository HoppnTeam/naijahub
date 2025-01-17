import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

export function LocationStatus() {
  const { location, isLocating, error, refreshLocation } = useLocation();

  if (isLocating) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Detecting location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-destructive">{error}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshLocation}
          className="h-8"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (location) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>
          {location.city || "Unknown City"}
          {location.state ? `, ${location.state}` : ""}
        </span>
      </div>
    );
  }

  return null;
}