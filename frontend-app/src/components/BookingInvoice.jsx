export default function BookingInvoice({ bookingDetails, setBookingDetails, slotPrice, onConfirm, errorMessage }) {
    const totalAmount = bookingDetails.noOfSlots * slotPrice;
  
    const handleCheckboxChange = (e) => {
      setBookingDetails(prev => ({
        ...prev,
        acceptedTerms: e.target.checked,
      }));
    };
  
    return (
      <div style={{ maxWidth: 400, marginTop: 20 }}>
        <h3>Invoice & Terms</h3>
        <p>Number of Slots: <b>{bookingDetails.noOfSlots}</b></p>
        <p>Price per Slot: <b>₹{slotPrice}</b></p>
        <p>Total Amount: <b>₹{totalAmount}</b></p>
        <label style={{ display: "block", margin: "15px 0" }}>
        <input
            type="checkbox"
            checked={bookingDetails.acceptedTerms || false}
            onChange={(e) => setBookingDetails({...bookingDetails, acceptedTerms: e.target.checked})}
            />{" "}
          I accept the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
        </label>
        <button
          onClick={onConfirm}
          disabled={!bookingDetails.acceptedTerms}
          style={{
            padding: "10px 20px",
            backgroundColor: bookingDetails.acceptedTerms ? "#28a745" : "#888",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: bookingDetails.acceptedTerms ? "pointer" : "not-allowed",
          }}
        >
          Confirm and Pay
        </button>
        {errorMessage && (
          <p style={{ marginTop: 15, color: "red" }}>{errorMessage}</p>
        )}
      </div>
    );
  }
  