import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Globe, Clock, MapPin } from "lucide-react";
import WorkshopMap from "./WorkshopMap";
import { Workshop } from "@/types/workshop";

interface WorkshopDetailsProps {
  workshop: Workshop;
  nearbyWorkshops?: Workshop[];
}

const WorkshopDetails = ({ workshop, nearbyWorkshops }: WorkshopDetailsProps) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{workshop.name}</CardTitle>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{workshop.address}, {workshop.city}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {workshop.phone_number && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${workshop.phone_number}`} className="text-primary hover:underline">
                {workshop.phone_number}
              </a>
            </div>
          )}
          {workshop.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${workshop.email}`} className="text-primary hover:underline">
                {workshop.email}
              </a>
            </div>
          )}
          {workshop.website && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <a href={workshop.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Visit Website
              </a>
            </div>
          )}
          {workshop.opening_hours && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Opening Hours</span>
            </div>
          )}
        </div>

        {workshop.services_offered && workshop.services_offered.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {workshop.services_offered.map((service, index) => (
                <span
                  key={index}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {workshop.latitude && workshop.longitude && (
          <div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
            {showMap && (
              <div className="h-[300px] mt-4">
                <WorkshopMap
                  latitude={workshop.latitude}
                  longitude={workshop.longitude}
                  name={workshop.name}
                  workshops={nearbyWorkshops}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkshopDetails;