const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parkingSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot' },
  bookingDate: Date,
  fromTime: Date,
  toTime: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  totalAmount: Number,
});

module.exports = mongoose.model('Booking', BookingSchema);
