import React from "react";
import "../styles/BookingForm.css";

export default function BookingForm({ bookingDetails, setBookingDetails, onSubmit, bookingMessage, maxSlots }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="booking-form">
      <label className="booking-label">
        Number of Slots:
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
        From Time:
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
        To Time:
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
        Confirm Booking
      </button>

      {bookingMessage && (
        <p
          className={`booking-message ${
            bookingMessage.startsWith("Booking successful") ? "success" : "error"
          }`}
        >
          {bookingMessage}
        </p>
      )}
    </form>
  );
}
