const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parkingSlot: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingSlot", required: true },
  fromTime: { type: Date, required: true },
  toTime: { type: Date, required: true },
  noOfSlots: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentRFID: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
