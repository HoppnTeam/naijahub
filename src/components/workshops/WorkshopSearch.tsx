import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/workshop';
import { WorkshopMap } from './WorkshopMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Navigation } from 'lucide-react';
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
        throw error;
      }

      // Calculate distance and filter workshops within 30 miles
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
        .filter((workshop) => workshop.distance <= 30)
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
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Error",
          description: "Unable to get your location. Please try again.",
          variant: "destructive",
        });
        setIsLocating(false);
      }
    );
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
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
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Workshops within 30 miles {workshops?.length ? `(${workshops.length} found)` : ''}
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : workshops?.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    No workshops found within 30 miles of your location
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {workshops?.map((workshop) => (
                  <Card key={workshop.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{workshop.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {workshop.distance?.toFixed(1)} miles
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          {workshop.address}, {workshop.city}, {workshop.state}
                        </p>
                        <p className="text-sm">{workshop.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div className="h-[600px] rounded-lg overflow-hidden">
            <WorkshopMap
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              workshops={workshops || []}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopSearch;