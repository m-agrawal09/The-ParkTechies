const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: String,
  totalSlots: Number,
  availableSlots: Number,
  price: Number,
  images: [String],
  active: { type: Boolean, default: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});

ParkingSlotSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ParkingSlot', ParkingSlotSchema);
