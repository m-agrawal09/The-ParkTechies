const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');
const authMiddleware = require('../middleware/auth'); // JWT auth

// Get all parking slots (for all users)
router.get('/', async (req, res) => {
  try {
    const slots = await ParkingSlot.find({ active: true }).populate('host', 'name email');
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// Create a new parking slot (host only)
router.post('/', authMiddleware, async (req, res) => {
  console.log('req.user:', req.user);
  console.log('req.body:', req.body);

  if (req.user.role !== 'host') return res.status(403).json({ error: 'Access denied' });

  try {
    const { address, totalSlots, price, images, location } = req.body;

    if (!address || !totalSlots || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate and set location with fallback if invalid/missing
    const locationValue =
      location && location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2
        ? location
        : { type: 'Point', coordinates: [0, 0] };

    // Ensure images is an array
    const imagesArray = Array.isArray(images) ? images : [];

    const newSlot = new ParkingSlot({
      host: req.user.userId,
      address,
      totalSlots,
      availableSlots: totalSlots,
      price,
      images: imagesArray,
      location: locationValue,
    });

    await newSlot.save();

    res.status(201).json({ message: 'Parking slot created', slot: newSlot });
  } catch (err) {
    console.error('Slot creation error:', err);
    res.status(500).json({ error: err.message || 'Failed to create slot' });
  }
});

module.exports = router;
