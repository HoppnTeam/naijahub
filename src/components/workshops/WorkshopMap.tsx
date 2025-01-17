import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Workshop } from '@/types/workshop';
import { supabase } from '@/integrations/supabase/client';

interface WorkshopMapProps {
  latitude: number;
  longitude: number;
  workshops: Workshop[];
}

export const WorkshopMap = ({ latitude, longitude, workshops }: WorkshopMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Fetch Mapbox token from Supabase Edge Function
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
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 12
    });

    // Add user location marker
    new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    // Add workshop markers
    workshops.forEach((workshop) => {
      if (workshop.latitude && workshop.longitude) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h3 class="font-semibold">${workshop.name}</h3>
             <p class="text-sm">${workshop.address}</p>
             <p class="text-sm">${workshop.distance?.toFixed(1)} miles away</p>`
          );

        new mapboxgl.Marker({ color: '#32a852' })
          .setLngLat([workshop.longitude, workshop.latitude])
          .setPopup(popup)
          .addTo(map.current);
      }
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, workshops, mapboxToken]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />;
};