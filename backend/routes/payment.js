const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");
const authMiddleware = require("../middleware/auth");

// Relaxed payment RFID verification for testing (accept any non-empty string)
async function verifyPaymentRFID(rfid) {
  if (!rfid || rfid.trim() === "") {
    return false;
  }
  return true;
}

router.post("/verify", authMiddleware, async (req, res) => {
  try {
    console.log("Payment verification request body:", req.body);

    const {
      parkingSlotId,
      fromTime,
      toTime,
      noOfSlots,
      paymentRFID,
      totalAmount,
    } = req.body;

    console.log("Verifying RFID:", paymentRFID);
    const isRFIDValid = await verifyPaymentRFID(paymentRFID);
    if (!isRFIDValid) {
      console.log("Invalid RFID");
      return res.status(400).json({ error: "Invalid Payment RFID" });
    }

    const slot = await ParkingSlot.findById(parkingSlotId);
    if (!slot) {
      console.log("Slot not found:", parkingSlotId);
      return res.status(404).json({ error: "Parking slot not found" });
    }

    if (slot.availableSlots < noOfSlots) {
      console.log("Not enough slots available.");
      return res.status(400).json({ error: "Insufficient slots available" });
    }

    slot.availableSlots -= noOfSlots;
    await slot.save();

    const booking = new Booking({
      user: req.user.userId,
      parkingSlot: parkingSlotId,
      fromTime,
      toTime,
      noOfSlots,
      totalAmount,
      status: "confirmed",
      paymentRFID,
    });
    await booking.save();

    console.log("Booking created:", booking._id);

    await sendBookingConfirmationEmail(req.user.email, booking);

    res.json({ message: "Payment verified and booking confirmed", booking });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

// Email sender stub
async function sendBookingConfirmationEmail(email, booking) {
  // Replace this stub with nodemailer integration or other mailing service
  console.log(`Send booking confirmation email to ${email} for booking ${booking._id}`);
}

module.exports = router;
