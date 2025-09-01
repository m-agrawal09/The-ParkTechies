const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  paymentId: String,
  amount: Number,
  status: { type: String, enum: ['pending', 'completed', 'failed'] },
  paymentDate: Date,
});

module.exports = mongoose.model('Payment', PaymentSchema);
