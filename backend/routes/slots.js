const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');
const authMiddleware = require('../middleware/auth');

// Get all active parking slots
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
  try {
    const { address, totalSlots, price, images, location, qrCode } = req.body;
    if (!address || !totalSlots || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newSlot = new ParkingSlot({
      host: req.user.userId,
      address,
      totalSlots,
      availableSlots: totalSlots,
      price,
      images: Array.isArray(images) ? images : [],
      qrCode: qrCode || "", // 👈 save qrCode if provided
      location: location || { type: 'Point', coordinates: [0, 0] },
    });

    await newSlot.save();
    res.status(201).json({ message: 'Parking slot created', slot: newSlot });
  } catch (err) {
    console.error('Slot creation error:', err);
    res.status(500).json({ error: 'Failed to create slot' });
  }
});

// Update a parking slot (host or admin)
router.put('/:id', authMiddleware, async (req, res) => {
  console.log("Incoming PUT request for ID:", req.params.id);
  try {
    const slot = await ParkingSlot.findById(req.params.id);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    // Only host who owns the slot or admin can edit
    if (slot.host.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update fields if they exist in request
    const {
      address,
      totalSlots,
      availableSlots,
      price,
      images,
      active,
      availability,
      location,
      qrCode, // 👈 include qrCode
    } = req.body;

    if (address !== undefined) slot.address = address;
    if (totalSlots !== undefined) slot.totalSlots = totalSlots;
    if (availableSlots !== undefined) slot.availableSlots = availableSlots;
    if (price !== undefined) slot.price = price;
    if (images !== undefined) slot.images = images;
    if (qrCode !== undefined) slot.qrCode = qrCode; // 👈 update qrCode
    if (active !== undefined) slot.active = active;
    if (availability !== undefined) slot.availability = availability;
    if (location !== undefined) slot.location = location;

    await slot.save();
    res.json({ message: 'Slot updated', slot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete a parking slot (host only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    if (String(slot.host) !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this slot' });
    }

    await slot.deleteOne();
    res.json({ message: 'Slot deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

module.exports = router;
