import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LocationCoordinates, LocationDetails, validateCoordinates, reverseGeocode } from "@/utils/location";

interface LocationContextType {
  location: LocationDetails | null;
  isLocating: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const detectLocation = async () => {
    setIsLocating(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const coordinates: LocationCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      if (!validateCoordinates(coordinates)) {
        throw new Error("Invalid coordinates received from geolocation service");
      }

      const locationDetails = await reverseGeocode(coordinates);
      
      if (!locationDetails) {
        throw new Error("Could not determine location details");
      }

      setLocation(locationDetails);

      toast({
        title: "Location detected",
        description: "We'll show you relevant content for your area.",
      });
    } catch (error) {
      let message = "Unable to detect your location. ";
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += "Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            message += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message += "Location request timed out.";
            break;
        }
      }
      
      setError(message);
      toast({
        title: "Location Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const refreshLocation = () => detectLocation();

  return (
    <LocationContext.Provider 
      value={{ 
        location, 
        isLocating, 
        error, 
        refreshLocation 
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}