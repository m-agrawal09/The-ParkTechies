const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const authMiddleware = require('../middleware/auth');

// Helper to generate array of dates (YYYY-MM-DD) between fromTime and toTime inclusive
function getDatesBetween(startDate, endDate) {
  const dates = [];
  const currDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currDate <= lastDate) {
    dates.push(currDate.toISOString().slice(0, 10)); // format YYYY-MM-DD
    currDate.setDate(currDate.getDate() + 1);
  }
  return dates;
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { parkingSlotId, fromTime, toTime, noOfSlots } = req.body;

    // Validate input presence
    if (!parkingSlotId || !fromTime || !toTime || !noOfSlots) {
      return res.status(400).json({ error: 'Missing required booking details' });
    }

    // Find parking slot and availability
    const slot = await ParkingSlot.findById(parkingSlotId);
    if (!slot) return res.status(404).json({ error: 'Parking slot not found' });

    // Compute booking dates
    const bookingDates = getDatesBetween(fromTime, toTime);

    // Check availability on all dates
    for (const date of bookingDates) {
      // If no record for date, assume totalSlots available
      const availableOnDate = slot.availability.get(date) ?? slot.totalSlots;
      if (availableOnDate < noOfSlots) {
        return res.status(400).json({ error: `Insufficient slots available on ${date}` });
      }
    }

    // Decrement availability for each date
    bookingDates.forEach(date => {
      const availableOnDate = slot.availability.get(date) ?? slot.totalSlots;
      slot.availability.set(date, availableOnDate - noOfSlots);
    });
    await slot.save();

    // Calculate total amount: days * slots * price per day
    const totalAmount = bookingDates.length * noOfSlots * slot.price;

    // Create the booking record
    const newBooking = new Booking({
      user: req.user.userId,
      parkingSlot: parkingSlotId,
      fromTime,
      toTime,
      noOfSlots,
      totalAmount,
      status: 'pending',
    });
    await newBooking.save();

    // Optionally send booking confirmation email here

    res.status(201).json({ message: 'Booking created', booking: newBooking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: 'Booking failed' });
  }
});

router.get('/mybookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('parkingSlot')  // Populate parking slot details for display
      .sort({ fromTime: -1 });  // Sort by most recent bookings first
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;
