import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Workshop } from "@/types/workshop";

interface WorkshopMapProps {
  latitude: number;
  longitude: number;
  name?: string;
  workshops?: Workshop[];
}

// Separate component to handle map view updates
const MapUpdater = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([latitude, longitude], 13);
  }, [latitude, longitude, map]);
  
  return null;
};

const WorkshopMap = ({ latitude, longitude, name = "Your Location", workshops }: WorkshopMapProps) => {
  const mapRef = useRef<Map | null>(null);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{name}</Popup>
      </Marker>
      {workshops?.map((workshop) => (
        workshop.latitude && workshop.longitude ? (
          <Marker
            key={workshop.id}
            position={[workshop.latitude, workshop.longitude]}
          >
            <Popup>{workshop.name}</Popup>
          </Marker>
        ) : null
      ))}
      <MapUpdater latitude={latitude} longitude={longitude} />
    </MapContainer>
  );
};

export default WorkshopMap;