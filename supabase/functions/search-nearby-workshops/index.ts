import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

interface Location {
  latitude: number;
  longitude: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location } = await req.json() as { location: Location };
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');

    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured');
    }

    // Search for auto-related businesses within 5km radius
    const radius = 5000;
    const types = ['car_repair', 'car_dealer', 'car_wash'];
    const results = [];

    for (const type of types) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        results.push(...data.results);
      }
    }

    // Process and format the results
    const workshops = results.map(place => ({
      id: crypto.randomUUID(),
      google_place_id: place.place_id,
      name: place.name,
      formatted_address: place.vicinity,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      google_rating: place.rating,
      google_reviews_count: place.user_ratings_total,
      place_types: place.types,
      business_status: place.business_status,
      workshop_type: determineWorkshopType(place.types)
    }));

    return new Response(
      JSON.stringify({ workshops }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    )
  }
})

function determineWorkshopType(types: string[]): string {
  if (types.includes('car_repair')) return 'mechanic';
  if (types.includes('car_wash')) return 'car_wash';
  if (types.includes('car_dealer')) return 'general_service';
  return 'general_service';
}