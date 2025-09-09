import React, { useState } from "react";
import BookingForm from "./BookingForm";
import BookingInvoice from "./BookingInvoice";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../styles/SlotDetails.css";
import { useLanguage } from "./LanguageContext";

// Custom maroon marker
const customMarker = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function SlotDetails({
  slot,
  onBack,
  bookingDetails,
  setBookingDetails,
  bookingMessage,
}) {
  const { language } = useLanguage();

  const texts = {
    en: {
      backButton: "← Back to slots",
      slotDetails: "Slot Details",
      address: "Address",
      totalSlots: "Total Slots",
      availableSlots: "Available Slots",
      pricePerSlot: "Price per Slot",
      host: "Host",
      phone: "Phone",
      noLocationData: "No location data available",
      bookingSectionTitle: "Booking",
      paymentTitle: "Payment",
      paymentInstruction: "Scan the host's QR code below to initiate payment:",
      enterPaymentRFID: "Enter Payment RFID:",
      paymentPlaceholder: "Enter RFID code here",
      paymentBtn: "Submit Payment",
      bookingSuccessTitle: "Booking Successful!",
      bookingSuccessMessage:
        "Your booking has been confirmed and a confirmation email has been sent.",
      bookingSuccessBtn: "OK",
      invalidBookingDetails:
        "Please enter valid booking details within allowed ranges",
      acceptTermsAlert: "You must accept the Terms and Conditions",
      enterRFIDAlert: "Please enter your payment RFID",
    },
    hi: {
      backButton: "← स्लॉट पर वापस जाएं",
      slotDetails: "स्लॉट विवरण",
      address: "पता",
      totalSlots: "कुल स्लॉट",
      availableSlots: "उपलब्ध स्लॉट",
      pricePerSlot: "प्रति स्लॉट कीमत",
      host: "मेज़बान",
      phone: "फोन",
      noLocationData: "स्थान डेटा उपलब्ध नहीं है",
      bookingSectionTitle: "बुकिंग",
      paymentTitle: "भुगतान",
      paymentInstruction: "भुगतान शुरू करने के लिए मेज़बान का क्यूआर कोड स्कैन करें:",
      enterPaymentRFID: "भुगतान RFID दर्ज करें:",
      paymentPlaceholder: "यहाँ RFID कोड दर्ज करें",
      paymentBtn: "भुगतान सबमिट करें",
      bookingSuccessTitle: "बुकिंग सफल!",
      bookingSuccessMessage:
        "आपकी बुकिंग पुष्टि हो गई है और एक पुष्टिकरण ईमेल भेजा गया है।",
      bookingSuccessBtn: "ठीक है",
      invalidBookingDetails: "कृपया सीमित रेंज में मान्य बुकिंग विवरण दर्ज करें",
      acceptTermsAlert: "आपको नियम और शर्तें स्वीकार करनी होंगी",
      enterRFIDAlert: "कृपया अपना भुगतान RFID दर्ज करें",
    },
  };

  const t = texts[language];
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePaymentSubmit = async () => {
    if (!bookingDetails.paymentRFID) {
      alert(t.enterRFIDAlert);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/payment/verify",
        {
          parkingSlotId: slot._id,
          fromTime: bookingDetails.fromTime,
          toTime: bookingDetails.toTime,
          noOfSlots: bookingDetails.noOfSlots,
          paymentRFID: bookingDetails.paymentRFID,
          totalAmount:
            slot.price *
            bookingDetails.noOfSlots *
            (Math.ceil(
              (new Date(bookingDetails.toTime) - new Date(bookingDetails.fromTime)) /
                (24 * 60 * 60 * 1000) +
                1
            )),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowSuccessModal(true);
    } catch (err) {
      alert(err.response?.data.error || `${t.paymentBtn} ${t.paymentBtn} असफल रहा।`);
    }
  };

  const resetBooking = () => {
    setShowSuccessModal(false);
    setStep(1);
    setBookingDetails({
      fromTime: "",
      toTime: "",
      noOfSlots: 1,
      acceptedTerms: false,
      paymentRFID: "",
    });
    onBack();
  };

  const [lng, lat] = slot.location?.coordinates || [null, null];

  return (
    <div className="slotdetails-wrapper">
      <button className="back-button" onClick={onBack}>
        {t.backButton}
      </button>

      <div className="slot-details">
        <div className="slot-info">
          <h2>{t.slotDetails}</h2>
          <table className="details-table">
            <tbody>
              <tr>
                <td>{t.address}</td>
                <td>{slot.address}</td>
              </tr>
              <tr>
                <td>{t.totalSlots}</td>
                <td>{slot.totalSlots}</td>
              </tr>
              <tr>
                <td>{t.availableSlots}</td>
                <td>{slot.availableSlots}</td>
              </tr>
              <tr>
                <td>{t.pricePerSlot}</td>
                <td>₹{slot.price}</td>
              </tr>
              <tr>
                <td>{t.host}</td>
                <td>
                  {slot.host?.name} ({slot.host?.email})
                </td>
              </tr>
              <tr>
                <td>{t.phone}</td>
                <td>{slot.host?.phone}</td>
              </tr>
            </tbody>
          </table>

          {slot.images?.length > 0 && (
            <div className="slot-images">
              {slot.images.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000${img}`}
                  alt={`Parking slot ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="slot-map">
          {lat && lng ? (
            <MapContainer center={[lat, lng]} zoom={16} className="map-container">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <Marker position={[lat, lng]} icon={customMarker}>
                <Popup>{slot.address}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p>{t.noLocationData}</p>
          )}
        </div>
      </div>

      {/* Booking steps in separate section */}
      <div className="booking-section">
        {step === 1 && (
          <BookingForm
            bookingDetails={bookingDetails}
            setBookingDetails={setBookingDetails}
            onSubmit={(e) => {
              e.preventDefault();
              if (
                bookingDetails.noOfSlots < 1 ||
                bookingDetails.noOfSlots > slot.availableSlots ||
                !bookingDetails.fromTime ||
                !bookingDetails.toTime
              ) {
                alert(t.invalidBookingDetails);
                return;
              }
              setStep(2);
            }}
            bookingMessage={bookingMessage}
            maxSlots={slot.availableSlots}
          />
        )}

        {step === 2 && (
          <BookingInvoice
            bookingDetails={bookingDetails}
            setBookingDetails={setBookingDetails}
            slotPrice={slot.price}
            onConfirm={() => {
              if (bookingDetails.acceptedTerms) {
                setStep(3);
              } else {
                alert(t.acceptTermsAlert);
              }
            }}
            errorMessage={bookingMessage}
          />
        )}

        {step === 3 && (
          <div className="payment-section">
            <h3>{t.paymentTitle}</h3>
            <p>{t.paymentInstruction}</p>
            {slot.qrCode && (
              <div className="slot-qrcode">
                <img
                  src={`http://localhost:5000${slot.qrCode}`}
                  alt="QR Code"
                  className="qr-preview"
                />
              </div>
            )}
            <label>
              {t.enterPaymentRFID}
              <input
                type="text"
                name="paymentRFID"
                value={bookingDetails.paymentRFID || ""}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    paymentRFID: e.target.value,
                  })
                }
                placeholder={t.paymentPlaceholder}
                className="rfid-input"
              />
            </label>
            <button className="payment-btn" onClick={handlePaymentSubmit}>
              {t.paymentBtn}
            </button>
          </div>
        )}
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{t.bookingSuccessTitle}</h2>
            <p>{t.bookingSuccessMessage}</p>
            <button className="success-btn" onClick={resetBooking}>
              {t.bookingSuccessBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
