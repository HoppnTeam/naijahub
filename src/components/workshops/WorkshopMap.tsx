import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Map, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Workshop } from "@/types/workshop";

// Fix for default marker icon in Leaflet
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]} icon={defaultIcon}>
        <Popup>{name}</Popup>
      </Marker>
      {workshops?.map((workshop) => (
        workshop.latitude && workshop.longitude ? (
          <Marker
            key={workshop.id}
            position={[workshop.latitude, workshop.longitude]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{workshop.name}</h3>
                <p className="text-sm text-muted-foreground">{workshop.address}</p>
                {workshop.phone_number && (
                  <p className="text-sm">📞 {workshop.phone_number}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ) : null
      ))}
      <MapUpdater latitude={latitude} longitude={longitude} />
    </MapContainer>
  );
};

export default WorkshopMap;