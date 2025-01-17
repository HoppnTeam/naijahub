import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/workshop';
import { WorkshopMap } from './WorkshopMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Navigation, Phone, Globe, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Location {
  latitude: number;
  longitude: number;
}

const WorkshopSearch = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const { data: workshops, isLoading } = useQuery({
    queryKey: ['nearby-workshops', userLocation],
    queryFn: async () => {
      if (!userLocation) return [];

      const { data, error } = await supabase
        .from('automotive_workshops')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Error fetching workshops:', error);
        toast({
          title: "Error",
          description: "Failed to fetch workshops. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      // Calculate distance and filter workshops within 50 kilometers
      const workshopsWithDistance = data
        .map((workshop) => ({
          ...workshop,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            workshop.latitude!,
            workshop.longitude!
          ),
        }))
        .filter((workshop) => workshop.distance <= 50) // 50km radius
        .sort((a, b) => a.distance - b.distance);

      return workshopsWithDistance;
    },
    enabled: !!userLocation,
  });

  const getUserLocation = () => {
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
        toast({
          title: "Success",
          description: "Location found! Searching for nearby workshops...",
        });
      },
      (error) => {
        let errorMessage = "Unable to get your location. ";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Please try again.";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLocating(false);
      }
    );
  };

  // Haversine formula to calculate distance between two points in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button 
          onClick={getUserLocation} 
          disabled={isLocating}
          className="w-full max-w-md"
        >
          {isLocating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting your location...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-4 w-4" />
              Find Workshops Near Me
            </>
          )}
        </Button>
      </div>

      {userLocation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[600px] rounded-lg overflow-hidden order-last lg:order-first">
            <WorkshopMap
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              workshops={workshops || []}
            />
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            <h2 className="text-lg font-semibold sticky top-0 bg-background z-10 py-2">
              Workshops within 50 kilometers {workshops?.length ? `(${workshops.length} found)` : ''}
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : workshops?.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    No workshops found within 50 kilometers of your location
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {workshops?.map((workshop) => (
                  <Card key={workshop.id} className="hover:shadow-md transition-shadow">
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
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopSearch;