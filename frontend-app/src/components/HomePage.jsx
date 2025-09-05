import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Parking Slot Booking</h1>
      <p className="home-subtitle">Your easy way to find and book parking slots.</p>
      <Link to="/auth">
        <button className="home-btn">Login / Register</button>
      </Link>
    </div>
  );
}
