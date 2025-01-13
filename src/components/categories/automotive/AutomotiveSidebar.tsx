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
          <CardTitle>Popular Workshops</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-1">AutoFix Lagos</h3>
            <p className="text-sm text-muted-foreground">
              Specialized in Japanese cars
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-1">Mechanic Plus</h3>
            <p className="text-sm text-muted-foreground">
              All brands, 24/7 service
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">• Always verify seller credentials</p>
          <p className="text-sm">• Meet in public places</p>
          <p className="text-sm">• Inspect before purchase</p>
          <p className="text-sm">• Document all transactions</p>
        </CardContent>
      </Card>
    </div>
  );
};