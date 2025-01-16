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
  const getIconForSubcategory = (name: string) => {
    switch (name.toLowerCase()) {
      case "destination guides":
        return <MapPin className="w-4 h-4 mr-2" />;
      case "travel stories":
        return <Camera className="w-4 h-4 mr-2" />;
      case "overseas travel":
        return <Plane className="w-4 h-4 mr-2" />;
      case "street foods":
        return <UtensilsCrossed className="w-4 h-4 mr-2" />;
      default:
        return <Globe className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Travel Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subcategories?.map((subcategory) => (
            <Button
              key={subcategory.id}
              variant="ghost"
              className="w-full justify-start"
            >
              {getIconForSubcategory(subcategory.name)}
              {subcategory.name}
            </Button>
          ))}
        </CardContent>
      </Card>

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
    </div>
  );
};