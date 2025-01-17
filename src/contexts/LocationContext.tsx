import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

interface LocationContextType {
  location: Location | null;
  isLocating: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null);
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

      const { latitude, longitude } = position.coords;

      // Attempt to get city and state using reverse geocoding
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
        );
        const data = await response.json();
        
        const cityFeature = data.features?.find((f: any) => 
          f.place_type.includes('place') || f.place_type.includes('locality')
        );
        const stateFeature = data.features?.find((f: any) => 
          f.place_type.includes('region') || f.place_type.includes('state')
        );

        setLocation({
          latitude,
          longitude,
          city: cityFeature?.text,
          state: stateFeature?.text
        });
      } catch (error) {
        // If reverse geocoding fails, still set the coordinates
        setLocation({ latitude, longitude });
      }

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