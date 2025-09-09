import React from "react";
import "../styles/BookingForm.css";
import { useLanguage } from "./LanguageContext";

export default function BookingForm({ bookingDetails, setBookingDetails, onSubmit, bookingMessage, maxSlots }) {
  const { language } = useLanguage();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Translation texts
  const texts = {
    en: {
      numberOfSlots: "Number of Slots:",
      fromTime: "From Time:",
      toTime: "To Time:",
      confirmBooking: "Confirm Booking",
    },
    hi: {
      numberOfSlots: "स्लॉट की संख्या:",
      fromTime: "आरंभ समय:",
      toTime: "समाप्ति समय:",
      confirmBooking: "बुकिंग पुष्टि करें",
    },
  };

  const t = texts[language];

  return (
    <form onSubmit={onSubmit} className="booking-form">
      <label className="booking-label">
        {t.numberOfSlots}
        <input
          type="number"
          name="noOfSlots"
          min={1}
          max={maxSlots}
          value={bookingDetails.noOfSlots}
          onChange={handleChange}
          required
          className="booking-input"
        />
      </label>

      <label className="booking-label">
        {t.fromTime}
        <input
          type="datetime-local"
          name="fromTime"
          value={bookingDetails.fromTime}
          onChange={handleChange}
          required
          className="booking-input"
        />
      </label>

      <label className="booking-label">
        {t.toTime}
        <input
          type="datetime-local"
          name="toTime"
          value={bookingDetails.toTime}
          onChange={handleChange}
          required
          className="booking-input"
        />
      </label>

      <button type="submit" className="booking-btn">
        {t.confirmBooking}
      </button>

      {bookingMessage && (
        <p
          className={`booking-message ${
            bookingMessage.startsWith(language === "en" ? "Booking successful" : "बुकिंग सफल") ? "success" : "error"
          }`}
        >
          {bookingMessage}
        </p>
      )}
    </form>
  );
}
