import React, { useState, useEffect } from "react";
import axios from "axios";
import SlotList from "./SlotList";
import SlotDetails from "./SlotDetails";
import Modal from "./Modal";
import MyBookings from "./MyBookings";
import "../styles/UserDashboard.css";
import { useLanguage } from "./LanguageContext";

const backendURL = "http://localhost:5000/api/slots";

export default function UserDashboard({ userName }) {
  const { language } = useLanguage();

  const texts = {
    en: {
      loadingSlots: "Loading available parking slots...",
      loadError: "Failed to load slots.",
      userDashboard: "User Dashboard",
      welcome: "Welcome",
      availableSlots: "Available Slots",
      myBookings: "My Bookings",
      noAvailableSlots: "No available parking slots found.",
      backToSlots: "Back to Slots",
      bookingSuccessPrefix: "Booking successful! Reference ID: ",
      bookingFailed: "Booking failed",
      enterValidSlots: (max) => `Please enter valid number of slots (1 to ${max})`,
      enterFromToTimes: "Please enter both from and to times.",
      bookingConfirmationEmail: "Booking confirmation email sent successfully!",
      bookingErrorColor: { color: "red" },
    },
    hi: {
      loadingSlots: "उपलब्ध पार्किंग स्लॉट लोड हो रहे हैं...",
      loadError: "स्लॉट लोड करने में विफल।",
      userDashboard: "उपयोगकर्ता डैशबोर्ड",
      welcome: "स्वागत है",
      availableSlots: "उपलब्ध स्लॉट",
      myBookings: "मेरी बुकिंग्स",
      noAvailableSlots: "कोई उपलब्ध पार्किंग स्लॉट नहीं मिला।",
      backToSlots: "स्लॉट्स पर वापस जाएं",
      bookingSuccessPrefix: "बुकिंग सफल! संदर्भ आईडी: ",
      bookingFailed: "बुकिंग विफल",
      enterValidSlots: (max) => `कृपया वैध स्लॉट संख्या दर्ज करें (1 से ${max} तक)`,
      enterFromToTimes: "कृपया दोनों शुरू और समाप्ति समय दर्ज करें।",
      bookingConfirmationEmail: "बुकिंग पुष्टिकरण ईमेल सफलतापूर्वक भेजा गया!",
      bookingErrorColor: { color: "red" },
    },
  };

  const t = texts[language];

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("slots");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    fromTime: "",
    toTime: "",
    noOfSlots: 1,
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
        setError(t.loadError);
        setLoading(false);
      }
    }
    fetchSlots();
  }, [t.loadError]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage("");

    if (
      !bookingDetails.noOfSlots ||
      bookingDetails.noOfSlots < 1 ||
      bookingDetails.noOfSlots > selectedSlot.availableSlots
    ) {
      setBookingMessage(t.enterValidSlots(selectedSlot.availableSlots));
      return;
    }
    if (!bookingDetails.fromTime || !bookingDetails.toTime) {
      setBookingMessage(t.enterFromToTimes);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const bookingData = {
        parkingSlotId: selectedSlot._id,
        fromTime: bookingDetails.fromTime,
        toTime: bookingDetails.toTime,
        noOfSlots: bookingDetails.noOfSlots,
        totalAmount: selectedSlot.price * bookingDetails.noOfSlots,
      };
      const res = await axios.post("http://localhost:5000/api/booking", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookingMessage(t.bookingSuccessPrefix + res.data.booking._id);
      setShowBookingForm(false);
      setModalMessage(t.bookingConfirmationEmail);
      setShowSuccessModal(true);

      // Refresh slot availability
      const updatedSlots = (
        await axios.get(backendURL, { headers: { Authorization: `Bearer ${token}` } })
      ).data;
      setSlots(updatedSlots.filter((slot) => slot.active && slot.availableSlots > 0));
      const updatedSlot = updatedSlots.find((slot) => slot._id === selectedSlot._id);
      setSelectedSlot(updatedSlot || null);
    } catch (err) {
      setBookingMessage(err.response?.data.error || t.bookingFailed);
    }
  };

  const handleBack = () => {
    setSelectedSlot(null);
    setShowBookingForm(false);
    setBookingMessage("");
    setBookingDetails({ fromTime: "", toTime: "", noOfSlots: 1 });
  };

  if (loading) return <p>{t.loadingSlots}</p>;
  if (error)
    return (
      <p style={t.bookingErrorColor}>
        {error}
      </p>
    );

  if (!selectedSlot) {
    return (
      <div className="dashboard-container">
        {showSuccessModal && (
          <Modal message={modalMessage} onClose={() => setShowSuccessModal(false)} />
        )}

        <h2 className="dashboard-title">{t.userDashboard}</h2>
        <p className="dashboard-welcome">
          {t.welcome}, {userName}!
        </p>

        <div className="dashboard-nav">
          <button
            onClick={() => setView("slots")}
            disabled={view === "slots"}
            className={`nav-btn ${view === "slots" ? "active" : ""}`}
          >
            {t.availableSlots}
          </button>
          <button
            onClick={() => setView("bookings")}
            disabled={view === "bookings"}
            className={`nav-btn ${view === "bookings" ? "active" : ""}`}
          >
            {t.myBookings}
          </button>
        </div>

        {view === "slots" && (
          <>
            <h3 className="section-title">{t.availableSlots}</h3>
            {slots.length === 0 ? (
              <p>{t.noAvailableSlots}</p>
            ) : (
              <SlotList slots={slots} onSelect={setSelectedSlot} />
            )}
          </>
        )}

        {view === "bookings" && (
          <>
            <MyBookings />
            <button onClick={() => setView("slots")} className="back-btn">
              {t.backToSlots}
            </button>
          </>
        )}
      </div>
    );
  }

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
