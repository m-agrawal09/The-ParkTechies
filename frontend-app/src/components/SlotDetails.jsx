import React, { useState } from "react";
import BookingForm from "./BookingForm";
import BookingInvoice from "./BookingInvoice";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../styles/SlotDetails.css";


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
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePaymentSubmit = async () => {
    if (!bookingDetails.paymentRFID) {
      alert("Please enter your payment RFID");
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
              (new Date(bookingDetails.toTime) -
                new Date(bookingDetails.fromTime)) /
                (24 * 60 * 60 * 1000) +
                1
            )),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowSuccessModal(true);
    } catch (err) {
      alert(err.response?.data.error || "Payment verification failed.");
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
        ← Back to slots
      </button>

      <div className="slot-details">
        <div className="slot-info">
          <h2>Slot Details</h2>
          <table className="details-table">
            <tbody>
              <tr>
                <td>Address</td>
                <td>{slot.address}</td>
              </tr>
              <tr>
                <td>Total Slots</td>
                <td>{slot.totalSlots}</td>
              </tr>
              <tr>
                <td>Available Slots</td>
                <td>{slot.availableSlots}</td>
              </tr>
              <tr>
                <td>Price per Slot</td>
                <td>₹{slot.price}</td>
              </tr>
              <tr>
                <td>Host</td>
                <td>
                  {slot.host?.name} ({slot.host?.email})
                </td>
              </tr>
              <tr>
                <td>Phone</td>
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
            <p>No location data available</p>
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
                alert("Please enter valid booking details within allowed ranges");
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
                alert("You must accept the Terms and Conditions");
              }
            }}
            errorMessage={bookingMessage}
          />
        )}

        {step === 3 && (
          <div className="payment-section">
            <h3>Payment</h3>
            <p>Scan the host's QR code below to initiate payment:</p>
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
              Enter Payment RFID:
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
                placeholder="Enter RFID code here"
                className="rfid-input"
              />
            </label>
            <button className="payment-btn" onClick={handlePaymentSubmit}>
              Submit Payment
            </button>
          </div>
        )}
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Booking Successful!</h2>
            <p>Your booking has been confirmed and a confirmation email has been sent.</p>
            <button className="success-btn" onClick={resetBooking}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
