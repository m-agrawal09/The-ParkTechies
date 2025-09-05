
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/booking/mybookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Bookings fetched:", res.data); // DEBUG log here
        setBookings(res.data);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p>{error}</p>;
  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div>
      <h3>My Bookings</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id} style={{ marginBottom: 10 }}>
            <strong>Address:</strong> {booking.parkingSlot.address} <br />
            <strong>From:</strong> {new Date(booking.fromTime).toLocaleString()} <br />
            <strong>To:</strong> {new Date(booking.toTime).toLocaleString()} <br />
            <strong>Slots Booked:</strong> {booking.noOfSlots} <br />
            <strong>Total Paid:</strong> ₹{booking.totalAmount} <br />
            <strong>Status:</strong> {booking.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
