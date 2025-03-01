import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  location: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
  interactive?: boolean;
}

export const MapComponent = ({ location, zoom = 12, interactive = true }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location.longitude, location.latitude],
      zoom: zoom,
      interactive: interactive,
    });

    new mapboxgl.Marker()
      .setLngLat([location.longitude, location.latitude])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [location, zoom, interactive]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
};
