import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Location } from '@/types/location';
import type { PostgrestResponse } from '@supabase/supabase-js';

export const useLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  const getCurrentLocation = async (): Promise<Location | null> => {
    try {
      setIsLoading(true);
      
      // Get user's location from browser
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Insert location into Supabase
      const { data, error } = await supabase
        .rpc('create_location', {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          city_name: 'Unknown City', // We'll use a geocoding service in production
          state_name: 'Unknown State',
          country_name: 'Nigeria'
        }) as PostgrestResponse<Location>;

      if (error) throw error;
      
      // Store the location in state
      if (data) {
        setUserLocation(data);
      }
      
      return data;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getCurrentLocation,
    userLocation,
    isLoading
  };
};
