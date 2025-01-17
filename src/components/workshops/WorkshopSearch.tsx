import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types/workshop';
import { WorkshopMap } from './WorkshopMap';
import { LocationButton } from './LocationButton';
import { WorkshopList } from './WorkshopList';
import { useToast } from '@/hooks/use-toast';
import { calculateDistance } from '@/utils/distance';

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
        .filter((workshop) => workshop.distance <= 50)
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

  return (
    <div className="space-y-6">
      <LocationButton isLocating={isLocating} onClick={getUserLocation} />

      {userLocation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[600px] rounded-lg overflow-hidden order-last lg:order-first">
            <WorkshopMap
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              workshops={workshops || []}
            />
          </div>
          <WorkshopList workshops={workshops} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default WorkshopSearch;