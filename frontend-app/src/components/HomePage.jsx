import React from "react";
import { Link } from "react-router-dom";
import Layout from "./Home_Layout";
import "../styles/HomePage.css";
import { useLanguage } from "./LanguageContext";

export default function HomePage() {
  const { language } = useLanguage();

  const texts = {
    en: {
      welcome: "Welcome to Parking Slot Booking",
      subtitle: "Your easy way to find and book parking slots.",
      loginRegister: "Login / Register",
    },
    hi: {
      welcome: "पार्किंग स्लॉट बुकिंग में आपका स्वागत है",
      subtitle: "अपने लिए आसान तरीका पार्किंग स्लॉट खोजें और बुक करें।",
      loginRegister: "लॉगिन / पंजीकरण करें",
    },
  };

  const t = texts[language];

  return (
    <Layout logoSrc="/images/logo.png">
    <div className="home-container">
      <div className="home-image-container">
        <img src="/Logo.png" alt="Center" className="home-image" />
      </div>
      <h1 className="home-title">{t.welcome}</h1>
      <p className="home-subtitle">{t.subtitle}</p>
      <Link to="/auth">
        <button className="home-btn">{t.loginRegister}</button>
      </Link>
    </div>
    </Layout>
  );
}
