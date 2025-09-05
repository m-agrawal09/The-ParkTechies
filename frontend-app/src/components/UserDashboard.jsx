import React, { useState, useEffect } from "react";
import axios from "axios";
import SlotList from "./SlotList";
import SlotDetails from "./SlotDetails";
import Modal from "./Modal";
import MyBookings from "./MyBookings";

const backendURL = "http://localhost:5000/api/slots";

export default function UserDashboard({ userName }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("slots");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ 
    fromTime: "", 
    toTime: "", 
    noOfSlots: 1 // Added number of slots here, default 1
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(backendURL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSlots(res.data.filter((slot) => slot.active && slot.availableSlots > 0));
        setLoading(false);
      } catch (err) {
        setError("Failed to load slots.");
        setLoading(false);
      }
    }
    fetchSlots();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage("");

    // Validate number of slots input
    if (!bookingDetails.noOfSlots || bookingDetails.noOfSlots < 1 || bookingDetails.noOfSlots > selectedSlot.availableSlots) {
      setBookingMessage(`Please enter valid number of slots (1 to ${selectedSlot.availableSlots})`);
      return;
    }
    if (!bookingDetails.fromTime || !bookingDetails.toTime) {
      setBookingMessage("Please enter both from and to times.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const bookingData = {
        parkingSlotId: selectedSlot._id,
        fromTime: bookingDetails.fromTime,
        toTime: bookingDetails.toTime,
        noOfSlots: bookingDetails.noOfSlots,  // Send number of slots to backend
        totalAmount: selectedSlot.price * bookingDetails.noOfSlots,
      };
      const res = await axios.post("http://localhost:5000/api/booking", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookingMessage("Booking successful! Reference ID: " + res.data.booking._id);
      setShowBookingForm(false);
      setModalMessage("Booking confirmation email sent successfully!");
      setShowSuccessModal(true);
      // Refresh data after booking
      const updatedSlots = (await axios.get(backendURL, { headers: { Authorization: `Bearer ${token}` } })).data;
      setSlots(updatedSlots.filter((slot) => slot.active && slot.availableSlots > 0));
      const updatedSlot = updatedSlots.find((slot) => slot._id === selectedSlot._id);
      setSelectedSlot(updatedSlot || null);
    } catch (err) {
      setBookingMessage(err.response?.data.error || "Booking failed");
    }
  };

  const handleBack = () => {
    setSelectedSlot(null);
    setShowBookingForm(false);
    setBookingMessage("");
    setBookingDetails({ fromTime: "", toTime: "", noOfSlots: 1 }); // Reset noOfSlots also
  };

  if (loading) return <p>Loading available parking slots...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!selectedSlot) {
    return (
      <div style={{ padding: 20 }}>
        {showSuccessModal && <Modal message={modalMessage} onClose={() => setShowSuccessModal(false)} />}
        <h2>User Dashboard</h2>
        <p>Welcome, {userName}!</p>
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setView("slots")}
            disabled={view === "slots"}
            style={{ marginRight: 10 }}
          >
            Available Slots
          </button>
          <button
            onClick={() => setView("bookings")}
            disabled={view === "bookings"}
          >
            My Bookings
          </button>
        </div>

        {view === "slots" && (
          <>
            <h3>Available Parking Slots</h3>
            {slots.length === 0 ? (
              <p>No available parking slots found.</p>
            ) : (
              <SlotList slots={slots} onSelect={setSelectedSlot} />
            )}
          </>
        )}

        {view === "bookings" && (
          <>
            <MyBookings />
            <button
              onClick={() => setView("slots")}
              style={{ marginTop: 20 }}
            >
              Back to Slots
            </button>
          </>
        )}
      </div>
    );
  }

  // If a slot is selected, show slot details (same as before)
  return (
    <SlotDetails
      slot={selectedSlot}
      onBack={handleBack}
      showBookingForm={showBookingForm}
      setShowBookingForm={setShowBookingForm}
      bookingDetails={bookingDetails}
      setBookingDetails={setBookingDetails}
      handleBookingSubmit={handleBookingSubmit}
      bookingMessage={bookingMessage}
    />
  );
}