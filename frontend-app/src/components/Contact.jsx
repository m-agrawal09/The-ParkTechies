import React from "react";
import "../styles/Contact.css";
import Layout from "./Home_Layout";
import { useLanguage } from "./LanguageContext";

export default function Contact() {
  const { language } = useLanguage();

  // Translations in English and Hindi
  const texts = {
    en: {
      contactUs: "Contact Us",
      queries: "For any queries contact",
      phone: "Phone:",
      email: "Email:",
    },
    hi: {
      contactUs: "संपर्क करें",
      queries: "किसी भी प्रश्न के लिए संपर्क करें",
      phone: "फोन:",
      email: "ईमेल:",
    },
  };

  const t = texts[language];

  return (
    <Layout logoSrc="/images/logo.png">
    <div className="contact-container">
      <h1 className="contact-title">{t.contactUs}</h1>
      <p className="contact-subtitle">{t.queries}</p>

      <div className="contact-box">
        <p className="contact-info">
          {t.phone}{" "}
          <a className="contact-link" href="tel:+911234567890">
            +91 12345 67890
          </a>
        </p>
        <p className="contact-info">
          {t.email}{" "}
          <a className="contact-link" href="mailto:example@email.com">
            example@email.com
          </a>
        </p>
      </div>
    </div>
    </Layout>
  );
}
