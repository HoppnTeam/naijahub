import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Workshop } from "@/types/workshop";

interface WorkshopMapProps {
  latitude: number;
  longitude: number;
  name?: string;
  workshops?: Workshop[];
}

const WorkshopMap = ({ latitude, longitude, name, workshops }: WorkshopMapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([latitude, longitude], 13);
    }
  }, [latitude, longitude]);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      whenCreated={mapInstance => { mapRef.current = mapInstance; }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{name}</Popup>
      </Marker>
      {workshops?.map(workshop => (
        <Marker 
          key={workshop.id} 
          position={[workshop.latitude || 0, workshop.longitude || 0]}
        >
          <Popup>{workshop.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WorkshopMap;