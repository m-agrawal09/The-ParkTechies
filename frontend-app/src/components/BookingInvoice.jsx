import React from "react";
import "../styles/BookingInvoice.css";
import { useLanguage } from "./LanguageContext";

export default function BookingInvoice({ bookingDetails, setBookingDetails, slotPrice, onConfirm, errorMessage }) {
  const { language } = useLanguage();

  const totalAmount = bookingDetails.noOfSlots * slotPrice;

  const handleCheckboxChange = (e) => {
    setBookingDetails((prev) => ({
      ...prev,
      acceptedTerms: e.target.checked,
    }));
  };

  // Translations for English and Hindi
  const texts = {
    en: {
      invoiceTitle: "Invoice & Terms",
      numberOfSlots: "Number of Slots:",
      pricePerSlot: "Price per Slot:",
      totalAmount: "Total Amount:",
      acceptTermsText: "I accept the",
      termsLinkText: "Terms and Conditions",
      confirmAndPay: "Confirm and Pay",
    },
    hi: {
      invoiceTitle: "इनवॉइस और शर्तें",
      numberOfSlots: "स्लॉट की संख्या:",
      pricePerSlot: "प्रति स्लॉट कीमत:",
      totalAmount: "कुल राशि:",
      acceptTermsText: "मैं स्वीकार करता हूँ",
      termsLinkText: "नियम और शर्तें",
      confirmAndPay: "पुष्टि करें और भुगतान करें",
    },
  };

  const t = texts[language];

  return (
    <div className="invoice-container">
      <h3 className="invoice-title">{t.invoiceTitle}</h3>
      <p className="invoice-line">
        {t.numberOfSlots} <b>{bookingDetails.noOfSlots}</b>
      </p>
      <p className="invoice-line">
        {t.pricePerSlot} <b>₹{slotPrice}</b>
      </p>
      <p className="invoice-line">
        {t.totalAmount} <b>₹{totalAmount}</b>
      </p>

      <label className="invoice-checkbox">
        <input
          type="checkbox"
          checked={bookingDetails.acceptedTerms || false}
          onChange={handleCheckboxChange}
        />{" "}
        {t.acceptTermsText}{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer">
          {t.termsLinkText}
        </a>
      </label>

      <button
        onClick={onConfirm}
        disabled={!bookingDetails.acceptedTerms}
        className={`invoice-btn ${bookingDetails.acceptedTerms ? "active" : "disabled"}`}
      >
        {t.confirmAndPay}
      </button>

      {errorMessage && <p className="invoice-error">{errorMessage}</p>}
    </div>
  );
}
