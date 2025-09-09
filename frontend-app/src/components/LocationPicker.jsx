import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "../styles/LocationPicker.css"; 

const DEFAULT_POSITION = [26.4499, 80.3319]; 

function LocationMarker({ onLocationChange }) {
  const [position, setPosition] = useState(DEFAULT_POSITION);

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
    />
  );
}

export default function LocationPicker({ onLocationChange }) {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={DEFAULT_POSITION}
        zoom={14}
        className="map-container" 
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
}
