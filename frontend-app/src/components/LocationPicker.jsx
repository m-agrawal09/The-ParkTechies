import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "../styles/LocationPicker.css";
import { useLanguage } from "./LanguageContext";

const DEFAULT_POSITION = [26.4499, 80.3319];

function LocationMarker({ onLocationChange }) {
  const [position, setPosition] = React.useState(DEFAULT_POSITION);
  const { language } = useLanguage();

  // Optional: If you want to show tooltip or popup with labels, define texts
  const texts = {
    en: { markerTooltip: "Drag or click to select location" },
    hi: { markerTooltip: "स्थान चुनने के लिए खींचें या क्लिक करें" },
  };
  const t = texts[language];

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationChange({
        type: "Point",
        coordinates: [e.latlng.lng, e.latlng.lat],
      });
      console.log("Location selected:", e.latlng.lng, e.latlng.lat);
    },
  });

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition([latlng.lat, latlng.lng]);
          onLocationChange({
            type: "Point",
            coordinates: [latlng.lng, latlng.lat],
          });
        },
      }}
      //tooltip for user guidance in selected language
      title={t.markerTooltip}
    />
  );
}

export default function LocationPicker({ onLocationChange }) {
  return (
    <div className="map-wrapper">
      <MapContainer center={DEFAULT_POSITION} zoom={14} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
}
