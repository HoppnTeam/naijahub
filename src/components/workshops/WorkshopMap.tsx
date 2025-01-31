import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface WorkshopMapProps {
  latitude: number;
  longitude: number;
}

export const WorkshopMap = ({ latitude, longitude }: WorkshopMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        // Fetch Mapbox token from Supabase Edge Function secrets
        const { data: { token }, error } = await supabase
          .functions.invoke('get-mapbox-token');

        if (error) throw error;

        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [longitude, latitude],
          zoom: 14
        });

        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map.current);

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />;
};