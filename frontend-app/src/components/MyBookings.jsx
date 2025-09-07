import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MyBookings.css";
import Modal from "./Modal";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmModal, setConfirmModal] = useState(null); // store bookingId when asking confirmation

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/booking/mybookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/booking/cancel/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "Cancelled" } : b
        )
      );
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Failed to cancel booking. Try again.");
    }
  };

  if (loading) return <p className="bookings-loading">Loading your bookings...</p>;
  if (error) return <p className="bookings-error">{error}</p>;
  if (bookings.length === 0) return <p className="bookings-empty">No bookings found.</p>;

  return (
    <div className="bookings-container">
      <h3 className="bookings-title">My Bookings</h3>
      <ul className="bookings-list">
        {bookings.map((booking) => (
          <li key={booking._id} className="booking-card">
            <p><strong>Address:</strong> {booking.parkingSlot.address}</p>
            <p><strong>From:</strong> {new Date(booking.fromTime).toLocaleString()}</p>
            <p><strong>To:</strong> {new Date(booking.toTime).toLocaleString()}</p>
            <p><strong>Slots Booked:</strong> {booking.noOfSlots}</p>
            <p><strong>Total Paid:</strong> ₹{booking.totalAmount}</p>
            <p className={`booking-status ${booking.status.toLowerCase()}`}>
              <strong>Status:</strong> {booking.status}
            </p>

            {booking.status.toLowerCase() !== "cancelled" && (
              <button
                className="cancel-btn"
                onClick={() => setConfirmModal(booking._id)}
              >
                Cancel Booking
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Confirmation Modal */}
      {confirmModal && (
        <Modal
          message="Are you sure you want to cancel this booking?"
          onClose={() => setConfirmModal(null)}
        >
          <div className="modal-actions">
            <button
              className="confirm-btn"
              onClick={() => {
                handleCancel(confirmModal);
                setConfirmModal(null);
              }}
            >
              Yes, Cancel
            </button>
            <button
              className="cancel-modal-btn"
              onClick={() => setConfirmModal(null)}
            >
              No
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
