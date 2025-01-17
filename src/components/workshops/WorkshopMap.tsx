import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Workshop } from '@/types/workshop';

interface WorkshopMapProps {
  latitude: number;
  longitude: number;
  workshops?: (Workshop & { distance?: number })[];
  name?: string;
}

export const WorkshopMap = ({ latitude, longitude, workshops = [], name }: WorkshopMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 11
    });

    // Add user location marker
    new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup().setHTML(name ? `<h3>${name}</h3>` : '<h3>Your Location</h3>'))
      .addTo(map.current);

    // Add workshop markers
    if (workshops.length > 0) {
      workshops.forEach((workshop) => {
        if (workshop.latitude && workshop.longitude) {
          const marker = new mapboxgl.Marker({ color: '#32a852' })
            .setLngLat([workshop.longitude, workshop.latitude])
            .setPopup(
              new mapboxgl.Popup().setHTML(`
                <h3>${workshop.name}</h3>
                ${workshop.distance ? `<p>${workshop.distance.toFixed(1)} miles away</p>` : ''}
              `)
            )
            .addTo(map.current!);
          markers.current.push(marker);
        }
      });

      // Fit bounds to include all markers
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([longitude, latitude]); // Include user location
      workshops.forEach((workshop) => {
        if (workshop.latitude && workshop.longitude) {
          bounds.extend([workshop.longitude, workshop.latitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [latitude, longitude, workshops, name]);

  return <div ref={mapContainer} className="h-full rounded-lg" />;
};