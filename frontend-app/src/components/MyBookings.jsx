import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MyBookings.css";
import Modal from "./Modal";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState(null); // store bookingId when asking confirmation

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing");
        
        const res = await axios.get("http://localhost:5000/api/booking/mybookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!Array.isArray(res.data)) {
          throw new Error("Invalid data format received");
        }
        
        setBookings(res.data);
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  
  const validBookings = bookings.filter(b => b && b.parkingSlot);

  if (loading) return <p className="bookings-loading">Loading your bookings...</p>;
  if (error) return <p className="bookings-error">{error}</p>;
  if (validBookings.length === 0) return <p className="bookings-empty">No bookings found.</p>;

  return (
    <div className="bookings-container">
      <h3 className="bookings-title">My Bookings</h3>
      {message && <p className="bookings-message">{message}</p>}
      <ul className="bookings-list">
        {validBookings.map((booking) => {
          const slotAddress = booking.parkingSlot?.address || "Address N/A";
          const fromTime = booking.fromTime ? new Date(booking.fromTime).toLocaleString() : "N/A";
          const toTime = booking.toTime ? new Date(booking.toTime).toLocaleString() : "N/A";
          const status = booking.status || "Unknown";

          return (
            <li key={booking._id} className="booking-card">
              <p><strong>Address:</strong> {slotAddress}</p>
              <p><strong>From:</strong> {fromTime}</p>
              <p><strong>To:</strong> {toTime}</p>
              <p><strong>Slots Booked:</strong> {booking.noOfSlots ?? "N/A"}</p>
              <p><strong>Total Paid:</strong> ₹{booking.totalAmount ?? "N/A"}</p>
              <p className={`booking-status ${status.toLowerCase()}`}>
                <strong>Status:</strong> {status}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
