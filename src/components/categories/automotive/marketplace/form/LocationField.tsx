import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LocationFieldProps {
  location: string;
  setLocation: (value: string) => void;
  setCoordinates: (value: { latitude: number; longitude: number } | null) => void;
}

export const LocationField = ({
  location,
  setLocation,
  setCoordinates,
}: LocationFieldProps) => {
  const { toast } = useToast();
  const [isValidatingLocation, setIsValidatingLocation] = useState(false);

  const validateLocation = async (locationString: string) => {
    setIsValidatingLocation(true);
    try {
      const { data, error } = await supabase.functions.invoke('geocode-location', {
        body: { address: locationString }
      });

      if (error) throw error;

      if (data && data.coordinates) {
        setCoordinates(data.coordinates);
        setLocation(data.formatted_address || locationString);
        return true;
      } else {
        toast({
          title: "Invalid Location",
          description: "Please enter a valid Nigerian address",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Location validation error:', error);
      toast({
        title: "Location Validation Failed",
        description: "Please try again or enter a different address",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsValidatingLocation(false);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    if (!newLocation) {
      setCoordinates(null);
    }
  };

  const handleLocationBlur = () => {
    if (location) {
      validateLocation(location);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="location">Location</Label>
      <div className="relative">
        <Input
          id="location"
          value={location}
          onChange={handleLocationChange}
          onBlur={handleLocationBlur}
          placeholder="Enter location in Nigeria"
          required
          className={isValidatingLocation ? "pr-10" : ""}
        />
        {isValidatingLocation && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};