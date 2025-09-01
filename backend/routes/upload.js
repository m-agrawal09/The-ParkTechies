const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

// Configure storage destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 123456789.jpg
  }
});

const upload = multer({ storage: storage });

// POST /api/upload - single file upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the file path or URL to frontend to save in database
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
