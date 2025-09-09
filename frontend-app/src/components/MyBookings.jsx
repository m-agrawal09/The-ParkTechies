import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MyBookings.css";
import Modal from "./Modal";
import { useLanguage } from "./LanguageContext";

export default function MyBookings() {
  const { language } = useLanguage();

  const texts = {
    en: {
      loading: "Loading your bookings...",
      error: "Failed to load bookings. Please try again later.",
      noBookings: "No bookings found.",
      myBookings: "My Bookings",
      address: "Address:",
      from: "From:",
      to: "To:",
      slotsBooked: "Slots Booked:",
      totalPaid: "Total Paid:",
      status: "Status:",
      unknown: "Unknown",
    },
    hi: {
      loading: "आपकी बुकिंग्स लोड हो रही हैं...",
      error: "बुकिंग्स लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।",
      noBookings: "कोई बुकिंग्स नहीं मिलीं।",
      myBookings: "मेरी बुकिंग्स",
      address: "पता:",
      from: "से:",
      to: "तक:",
      slotsBooked: "बुक किए गए स्लॉट:",
      totalPaid: "कुल भुगतान:",
      status: "स्थिति:",
      unknown: "अज्ञात",
    },
  };

  const t = texts[language];

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState(null); // For confirmation modal

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
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [t.error]);

  const validBookings = bookings.filter((b) => b && b.parkingSlot);

  if (loading) return <p className="bookings-loading">{t.loading}</p>;
  if (error) return <p className="bookings-error">{error}</p>;
  if (validBookings.length === 0) return <p className="bookings-empty">{t.noBookings}</p>;

  return (
    <div className="bookings-container">
      <h3 className="bookings-title">{t.myBookings}</h3>
      {message && <p className="bookings-message">{message}</p>}
      <ul className="bookings-list">
        {validBookings.map((booking) => {
          const slotAddress = booking.parkingSlot?.address || t.unknown;
          const fromTime = booking.fromTime ? new Date(booking.fromTime).toLocaleString() : "N/A";
          const toTime = booking.toTime ? new Date(booking.toTime).toLocaleString() : "N/A";
          const status = booking.status || t.unknown;

          return (
            <li key={booking._id} className="booking-card">
              <p>
                <strong>{t.address}</strong> {slotAddress}
              </p>
              <p>
                <strong>{t.from}</strong> {fromTime}
              </p>
              <p>
                <strong>{t.to}</strong> {toTime}
              </p>
              <p>
                <strong>{t.slotsBooked}</strong> {booking.noOfSlots ?? "N/A"}
              </p>
              <p>
                <strong>{t.totalPaid}</strong> ₹{booking.totalAmount ?? "N/A"}
              </p>
              <p className={`booking-status ${status.toLowerCase()}`}>
                <strong>{t.status}</strong> {status}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
