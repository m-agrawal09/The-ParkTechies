import React, { useState } from "react";
import { useLanguage } from "./LanguageContext";  // Import language context
import "../styles/Header.css";

const Header = ({ logoSrc }) => {
  const [fontSize, setFontSize] = useState(16); // default font size
  const { language, toggleLanguage } = useLanguage(); // get global language state and toggle function

  const changeFontSize = (size) => setFontSize(size);

  const texts = {
    en: {
      title: "DevoteeEase : Vehicle Parking Service",
      home: "Home",
      contact: "Contact Us",
      langLabel: "En",
    },
    hi: {
      title: "देवोतीईज : वाहन पार्किंग सेवा",
      home: "होम",
      contact: "संपर्क करें",
      langLabel: "Hi",
    },
  };

  const t = texts[language];

  return (
    <header className="app-header">
      <div className="header-left">
        <img
          src="/Logo.png"
          alt="Logo"
          className="header-logo"
          style={{ width: "20%", height: "auto" }}
        />
        <h1 style={{ fontSize: `${fontSize}px` }}>{t.title}</h1>
      </div>

      <div className="header-right">
        <button onClick={() => (window.location.href = "/")}>{t.home}</button>
        <button onClick={() => (window.location.href = "/contact")}>{t.contact}</button>

        <div className="font-controls">
          <button onClick={() => changeFontSize(fontSize + 2)}>A+</button>
          <button onClick={() => changeFontSize(16)}>A</button>
          <button onClick={() => changeFontSize(fontSize - 2)}>A-</button>
        </div>

        <button className="lang-switcher" onClick={toggleLanguage}>
          {t.langLabel}
        </button>
      </div>
    </header>
  );
};

export default Header;
