import React, { useState } from "react";
import "../styles/Header.css";

const Header = ({ logoSrc }) => {
  const [fontSize, setFontSize] = useState(16); // default font size
  const [language, setLanguage] = useState("En"); // default language

  const changeFontSize = (size) => setFontSize(size);
  const toggleLanguage = () =>
    setLanguage(language === "En" ? "Hi" : "En");

  return (
    <header className="app-header">
      <div className="header-left">
        <img src="/Logo.png" alt="Logo" className="header-logo" style={{ width: "20%", height: "auto" }} />
        <h1 style={{ fontSize: `${fontSize}px` }}>
          DevoteeEase : Vehicle Parking Service
        </h1>
      </div>

      <div className="header-right">
        <button onClick={() => (window.location.href = "/")}>Home</button>
        <button onClick={() => (window.location.href = "/contact")}>
          Contact Us
        </button>

        <div className="font-controls">
          <button onClick={() => changeFontSize(fontSize + 2)}>A+</button>
          <button onClick={() => changeFontSize(16)}>A</button>
          <button onClick={() => changeFontSize(fontSize - 2)}>A-</button>
        </div>

        <button className="lang-switcher" onClick={toggleLanguage}>
          {language}
        </button>
        <button onClick={() => (window.location.href = "/")}>Log out</button>
      </div>
    </header>
  );
};

export default Header;
