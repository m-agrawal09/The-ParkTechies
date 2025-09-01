const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth'); // JWT auth

// Create a new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { parkingSlotId, fromTime, toTime, totalAmount } = req.body;
    const newBooking = new Booking({
      user: req.user.userId,
      parkingSlot: parkingSlotId,
      bookingDate: new Date(),
      fromTime,
      toTime,
      totalAmount,
      status: 'pending',
    });
    await newBooking.save();
    res.status(201).json({ message: 'Booking created', booking: newBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking creation failed' });
  }
});

module.exports = router;
