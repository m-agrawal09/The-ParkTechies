import React, { useState } from "react";
import BookingForm from "./BookingForm";
import BookingInvoice from "./BookingInvoice";
import QRCode from "react-qr-code";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function SlotDetails({
  slot,
  onBack,
  bookingDetails,
  setBookingDetails,
  bookingMessage,
}) {
  const [step, setStep] = useState(1); // 1=BookingForm, 2=Invoice, 3=Payment
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

  // Extract coordinates from GeoJSON location: [lng, lat]
  const [lng, lat] = slot.location?.coordinates || [null, null];


  return (
    <>
      <button onClick={onBack} style={{ marginBottom: 20 }}>
        ← Back to slots
      </button>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h2>Slot Details</h2>
          <h3>{slot.address}</h3>
          <p>
            <strong>Total Slots:</strong> {slot.totalSlots}
          </p>
          <p>
            <strong>Available Slots:</strong> {slot.availableSlots}
          </p>
          <p>
            <strong>Price per Slot:</strong> ₹{slot.price}
          </p>
          <p>
            <strong>Host:</strong> {slot.host?.name} ({slot.host?.email})
          </p>
          {slot.images?.length > 0 && (
            <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
              {slot.images.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000${img}`}
                  alt={`Slot image ${i}`}
                  style={{ height: 150, borderRadius: 6 }}
                />
              ))}
            </div>
          )}
        </div>
        

        {/* <div style={{ flex: 1, height: 400 }}>
          {lat && lng ? (
            <MapContainer
              center={[lat, lng]}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <Marker position={[lat, lng]}>
                <Popup>{slot.address}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p>No location data available</p>
          )}
        </div> */}
      </div>

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
        <>
          <h3>Payment</h3>
          <p>Scan the host's QR code below to initiate payment:</p>
          <div style={{ margin: "15px 0" }}>
            <QRCode
              value={slot.host?.paymentQRCode || "default-qr-data"}
              size={150}
            />
          </div>
          <label>
            Enter Payment RFID:
            <input
              type="text"
              name="paymentRFID"
              value={bookingDetails.paymentRFID || ""}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, paymentRFID: e.target.value })
              }
              placeholder="Enter RFID code here"
              style={{ width: "100%", padding: 8, marginTop: 5 }}
            />
          </label>
          <br />
          <button
            onClick={handlePaymentSubmit}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Submit Payment
          </button>
        </>
      )}

      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 30,
              borderRadius: 10,
              textAlign: "center",
              maxWidth: 400,
            }}
          >
            <h2>Booking Successful!</h2>
            <p>Your booking has been confirmed and a confirmation email has been sent.</p>
            <button
              onClick={resetBooking}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
