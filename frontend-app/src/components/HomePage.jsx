import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Welcome to Parking Slot Booking</h1>
      <p>Your easy way to find and book parking slots.</p>
      <Link to="/auth">
        <button style={{
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
        }}>
          Login / Register
        </button>
      </Link>
    </div>
  );
}
