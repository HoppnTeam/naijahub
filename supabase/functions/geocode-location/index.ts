import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface GeocodeRequest {
  address: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { address } = await req.json() as GeocodeRequest;
    
    if (!address) {
      throw new Error('Address is required');
    }

    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${data.status}`);
    }

    const result = data.results[0];
    const location = {
      coordinates: {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
      },
      formatted_address: result.formatted_address,
      place_id: result.place_id,
    };

    // Extract city and state from address components
    result.address_components.forEach((component: any) => {
      if (component.types.includes('locality')) {
        location['city'] = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        location['state'] = component.long_name;
      }
    });

    return new Response(JSON.stringify(location), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})