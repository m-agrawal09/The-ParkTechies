import React from "react";
import { Link } from "react-router-dom";
import Layout from "./Home_Layout";
import "../styles/HomePage.css";

export default function HomePage() {
  return (
    <Layout logoSrc="/images/logo.png">
      <div className="home-container">
        <div className="home-image-container">
          <img src="/Logo.png" alt="Center" className="home-image"/>
        </div>
        <h1 className="home-title">Welcome to Parking Slot Booking</h1>
        <p className="home-subtitle">Your easy way to find and book parking slots.</p>
        <Link to="/auth">
          <button className="home-btn">Login / Register</button>
        </Link>
      </div>
    </Layout>
  );
}
