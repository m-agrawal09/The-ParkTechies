import React, { useState, useEffect } from "react";
import axios from "axios";

const backendURL = "http://localhost:5000/api/slots";

export default function UserDashboard({ userName }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSlots() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(backendURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const availableSlots = res.data.filter(slot => slot.active && slot.availableSlots > 0);
        setSlots(availableSlots);
        setLoading(false);
      } catch (err) {
        setError("Failed to load slots.");
        setLoading(false);
      }
    }
    fetchSlots();
  }, []);

  if (loading) return <p>Loading available parking slots...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Handle back to list
  const handleBack = () => {
    setSelectedSlot(null);
  };

  if (selectedSlot) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={handleBack} style={{ marginBottom: 20 }}>← Back to slots</button>
        <h2>Slot Details</h2>
        <h3>{selectedSlot.address}</h3>
        <p><strong>Total Slots:</strong> {selectedSlot.totalSlots}</p>
        <p><strong>Available Slots:</strong> {selectedSlot.availableSlots}</p>
        <p><strong>Price per Slot:</strong> ₹{selectedSlot.price}</p>
        <p><strong>Host:</strong> {selectedSlot.host?.name} ({selectedSlot.host?.email})</p>
        {selectedSlot.images?.length > 0 && (
          <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
            {selectedSlot.images.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000${img}`}
                alt={`Slot image ${i}`}
                style={{ height: 150, borderRadius: 6 }}
              />
            ))}
          </div>
        )}
        {/* Add booking functionality here later */}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>User Dashboard</h2>
      <p>Welcome, {userName}!</p>

      <h3>Available Parking Slots</h3>
      {slots.length === 0 ? (
        <p>No available parking slots found.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {slots.map((slot) => (
            <li
              key={slot._id}
              onClick={() => setSelectedSlot(slot)}
              style={{ 
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: 15,
                marginBottom: 15,
                cursor: "pointer",
                userSelect: "none",
              }}
              title="Click for details"
            >
              <h4>{slot.address}</h4>
              <p>Available Slots: {slot.availableSlots}</p>
              <p>Price: ₹{slot.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
