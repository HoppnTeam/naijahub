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
    const { location, radius = 50000 } = await req.json() as { location: Location, radius: number };
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');

    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured');
    }

    // Search for auto-related businesses within radius
    const types = ['car_repair', 'car_dealer', 'car_wash'];
    const results = [];

    for (const type of types) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        // Get additional details for each place
        for (const place of data.results) {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,rating,user_ratings_total,formatted_phone_number,website,opening_hours,types,business_status&key=${GOOGLE_PLACES_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          
          if (detailsData.result) {
            const placeDetails = detailsData.result;
            results.push({
              id: crypto.randomUUID(),
              google_place_id: place.place_id,
              name: placeDetails.name,
              formatted_address: placeDetails.formatted_address,
              latitude: placeDetails.geometry.location.lat,
              longitude: placeDetails.geometry.location.lng,
              google_rating: placeDetails.rating,
              google_reviews_count: placeDetails.user_ratings_total,
              phone_number: placeDetails.formatted_phone_number,
              website: placeDetails.website,
              place_types: placeDetails.types,
              business_status: placeDetails.business_status,
              workshop_type: determineWorkshopType(placeDetails.types),
              opening_hours: placeDetails.opening_hours?.weekday_text,
              verified: false
            });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ workshops: results }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in search-nearby-workshops:', error);
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