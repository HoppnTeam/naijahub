import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Camera, Plane, UtensilsCrossed } from "lucide-react";

interface TravelSidebarProps {
  subcategories?: {
    id: string;
    name: string;
    description?: string | null;
  }[];
}

export const TravelSidebar = ({ subcategories }: TravelSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Popular Destinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="ghost" className="w-full justify-start">
            <MapPin className="w-4 h-4 mr-2" />
            Lagos
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MapPin className="w-4 h-4 mr-2" />
            Abuja
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MapPin className="w-4 h-4 mr-2" />
            Port Harcourt
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Travel Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="ghost" className="w-full justify-start">
            <Plane className="w-4 h-4 mr-2" />
            Flight Tips
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Globe className="w-4 h-4 mr-2" />
            Visa Guide
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Camera className="w-4 h-4 mr-2" />
            Photography Tips
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <UtensilsCrossed className="w-4 h-4 mr-2" />
            Food Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};