import { Workshop } from '@/types/workshop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Globe, Wrench, Star } from 'lucide-react';

interface WorkshopCardProps {
  workshop: Workshop & { distance?: number };
}

export const WorkshopCard = ({ workshop }: WorkshopCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{workshop.name}</span>
          <span className="text-sm text-muted-foreground">
            {workshop.distance?.toFixed(1)} km
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {workshop.workshop_type && (
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="w-4 h-4" />
              <span className="capitalize">{workshop.workshop_type.replace(/_/g, " ")}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{workshop.formatted_address || workshop.address}</span>
          </div>
          {workshop.google_rating && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{workshop.google_rating.toFixed(1)} ({workshop.google_reviews_count} reviews)</span>
            </div>
          )}
          {workshop.phone_number && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              <span>{workshop.phone_number}</span>
            </div>
          )}
          {workshop.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4" />
              <a 
                href={workshop.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};