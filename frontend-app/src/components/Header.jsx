import React, { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { useFontSize } from "./FontSizeContext"
import "../styles/Header.css";

const Header = ({ logoSrc }) => {
  const { fontSize, setFontSize } = useFontSize();
  const { language, toggleLanguage } = useLanguage();

  const changeFontSize = (size) => setFontSize(size);

  return (
    <header className="app-header">
      <div className="header-left">
        <img
          src="/Logo.png"
          alt="Logo"
          className="header-logo"
          style={{ width: "20%", height: "auto" }}
        />
        <h1 style={{ fontSize: `${fontSize}px` }}>
          {language === "en"
            ? "DevoteeEase : Vehicle Parking Service"
            : "DevoteeEase : वाहन पार्किंग सेवा"}
        </h1>
      </div>

      <div className="header-right">
        <button onClick={() => (window.location.href = "/")}>
          {language === "en" ? "Home" : "होम"}
        </button>
        <button onClick={() => (window.location.href = "/contact")}>
          {language === "en" ? "Contact Us" : "संपर्क करें"}
        </button>

        <div className="font-controls">
          <button onClick={() => setFontSize(fontSize + 2)}>A+</button>
          <button onClick={() => setFontSize(16)}>A</button>
          <button onClick={() => setFontSize(fontSize - 2)}>A-</button>
        </div>

        <button className="lang-switcher" onClick={toggleLanguage}>
          {language === "en" ? "En" : "Hi"}
        </button>
      </div>
    </header>
  );
};

export default Header;
