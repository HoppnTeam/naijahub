import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Wrench, Shield, MapPin } from "lucide-react";

export const AutomotiveSidebar = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="ghost" className="w-full justify-start">
            <Wrench className="w-4 h-4 mr-2" />
            Find Mechanics
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Safety Tips
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MapPin className="w-4 h-4 mr-2" />
            Nearby Workshops
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-2">
            <li>Regular maintenance is key</li>
            <li>Check tire pressure monthly</li>
            <li>Keep emergency contacts handy</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};