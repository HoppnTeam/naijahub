import { supabase } from "@/integrations/supabase/client";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationDetails {
  city?: string;
  state?: string;
  formatted_address?: string;
  place_id?: string;
  coordinates: LocationCoordinates;
}

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// Cache implementation
const locationCache = new Map<string, { data: any; timestamp: number }>();

export async function geocodeAddress(address: string): Promise<LocationDetails | null> {
  // Check cache first
  const cacheKey = `geocode:${address}`;
  const cachedResult = getFromCache(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const { data, error } = await supabase.functions.invoke('geocode-location', {
      body: { address }
    });

    if (error) throw error;
    
    // Cache the result
    setInCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function reverseGeocode(coordinates: LocationCoordinates): Promise<LocationDetails | null> {
  // Check cache first
  const cacheKey = `reverse:${coordinates.latitude},${coordinates.longitude}`;
  const cachedResult = getFromCache(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  try {
    const { data, error } = await supabase.functions.invoke('reverse-geocode', {
      body: coordinates
    });

    if (error) throw error;

    // Cache the result
    setInCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

export function validateCoordinates(coordinates: LocationCoordinates): boolean {
  const { latitude, longitude } = coordinates;
  
  // Basic coordinate validation
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return false;
  }
  
  // Check latitude range (-90 to 90)
  if (latitude < -90 || latitude > 90) {
    return false;
  }
  
  // Check longitude range (-180 to 180)
  if (longitude < -180 || longitude > 180) {
    return false;
  }
  
  return true;
}

// Cache helper functions
function getFromCache(key: string): any | null {
  const cached = locationCache.get(key);
  if (!cached) return null;
  
  // Check if cache is still valid
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    locationCache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setInCache(key: string, data: any): void {
  locationCache.set(key, {
    data,
    timestamp: Date.now()
  });
}