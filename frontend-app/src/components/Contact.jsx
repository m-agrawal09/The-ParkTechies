import React from "react";
import "../styles/Contact.css";
import Layout from "./Layout";

export default function Contact() {
  return (
    <Layout logoSrc="/images/logo.png">
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">For any queries contact</p>

      <div className="contact-box">
        <p className="contact-info">
          Phone:{" "}
          <a className="contact-link" href="tel:+911234567890">
            +91 12345 67890
          </a>
        </p>
        <p className="contact-info">
          Email:{" "}
          <a className="contact-link" href="mailto:example@email.com">
            example@email.com
          </a>
        </p>
      </div>
    </div>
    </Layout>
  );
}
