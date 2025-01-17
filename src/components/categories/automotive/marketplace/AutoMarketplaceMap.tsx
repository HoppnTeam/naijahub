import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AutoMarketplaceMapProps {
  listings: any[];
  isLoading: boolean;
}

export const AutoMarketplaceMap = ({ listings, isLoading }: AutoMarketplaceMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
      if (error) {
        console.error('Error fetching Mapbox token:', error);
        return;
      }
      setMapboxToken(token);
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !listings?.length) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [8.6753, 9.0820], // Nigeria's center coordinates
      zoom: 5
    });

    // Add markers for listings
    listings.forEach((listing) => {
      if (listing.latitude && listing.longitude) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<div class="p-2">
              <h3 class="font-semibold">${listing.title}</h3>
              <p class="text-sm">₦${listing.price.toLocaleString()}</p>
              <p class="text-xs text-muted-foreground">${listing.location}</p>
            </div>`
          );

        new mapboxgl.Marker()
          .setLngLat([listing.longitude, listing.latitude])
          .setPopup(popup)
          .addTo(map.current);
      }
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
    };
  }, [listings, mapboxToken]);

  if (isLoading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="h-[600px] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  );
};