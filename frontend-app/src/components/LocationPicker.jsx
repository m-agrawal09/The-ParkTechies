import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const DEFAULT_POSITION = [26.4499, 80.3319]; // Simhastha area example

function LocationMarker({ onLocationChange }) {
  const [position, setPosition] = useState(DEFAULT_POSITION);

  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationChange({ type: "Point", coordinates: [e.latlng.lng, e.latlng.lat] }); // GeoJSON format: [lng, lat]
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
          onLocationChange({ type: "Point", coordinates: [latlng.lng, latlng.lat] });
        },
      }}
    />
  );
}

export default function LocationPicker({ onLocationChange }) {
  return (
    <MapContainer center={DEFAULT_POSITION} zoom={14} style={{ height: 300, width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker onLocationChange={onLocationChange} />
    </MapContainer>
  );
}
