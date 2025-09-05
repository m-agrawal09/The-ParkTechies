export default function BookingForm({ bookingDetails, setBookingDetails, onSubmit, bookingMessage, maxSlots }) {
    const handleChange = (e) => {
      const { name, value, type } = e.target;
      setBookingDetails((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    };
  
    return (
      <form onSubmit={onSubmit} style={{ maxWidth: 400 }}>
        <label>
          Number of Slots:
          <input
            type="number"
            name="noOfSlots"
            min={1}
            max={maxSlots}
            value={bookingDetails.noOfSlots}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
        </label>
        <label>
          From Time:
          <input
            type="datetime-local"
            name="fromTime"
            value={bookingDetails.fromTime}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
        </label>
        <label>
          To Time:
          <input
            type="datetime-local"
            name="toTime"
            value={bookingDetails.toTime}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Confirm Booking
        </button>
        {bookingMessage && (
          <p
            style={{
              marginTop: 15,
              color: bookingMessage.startsWith("Booking successful") ? "green" : "red",
            }}
          >
            {bookingMessage}
          </p>
        )}
      </form>
    );
  }
  