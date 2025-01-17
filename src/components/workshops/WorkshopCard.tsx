import { Workshop } from '@/types/workshop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Globe, Wrench } from 'lucide-react';

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
          <div className="flex items-center gap-2 text-sm">
            <Wrench className="w-4 h-4" />
            <span className="capitalize">{workshop.workshop_type.replace(/_/g, " ")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{workshop.address}, {workshop.city}, {workshop.state}</span>
          </div>
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