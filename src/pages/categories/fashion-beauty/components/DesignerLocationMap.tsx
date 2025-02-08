
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface DesignerLocationMapProps {
  latitude: number;
  longitude: number;
  businessName: string;
}

export const DesignerLocationMap = ({ latitude, longitude, businessName }: DesignerLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
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

        // Add marker for designer's location
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${businessName}</h3>`))
          .addTo(map.current);

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, businessName]);

  return <div ref={mapContainer} className="w-full h-[300px] rounded-lg" />;
};
