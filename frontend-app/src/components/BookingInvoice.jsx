import React from "react";
import "../styles/BookingInvoice.css";

export default function BookingInvoice({ bookingDetails, setBookingDetails, slotPrice, onConfirm, errorMessage }) {
  const totalAmount = bookingDetails.noOfSlots * slotPrice;

  const handleCheckboxChange = (e) => {
    setBookingDetails((prev) => ({
      ...prev,
      acceptedTerms: e.target.checked,
    }));
  };

  return (
    <div className="invoice-container">
      <h3 className="invoice-title">Invoice & Terms</h3>
      <p className="invoice-line">
        Number of Slots: <b>{bookingDetails.noOfSlots}</b>
      </p>
      <p className="invoice-line">
        Price per Slot: <b>₹{slotPrice}</b>
      </p>
      <p className="invoice-line">
        Total Amount: <b>₹{totalAmount}</b>
      </p>

      <label className="invoice-checkbox">
        <input
          type="checkbox"
          checked={bookingDetails.acceptedTerms || false}
          onChange={handleCheckboxChange}
        />{" "}
        I accept the{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer">
          Terms and Conditions
        </a>
      </label>

      <button
        onClick={onConfirm}
        disabled={!bookingDetails.acceptedTerms}
        className={`invoice-btn ${bookingDetails.acceptedTerms ? "active" : "disabled"}`}
      >
        Confirm and Pay
      </button>

      {errorMessage && <p className="invoice-error">{errorMessage}</p>}
    </div>
  );
}
