const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const paymentRoutes = require("./routes/payment");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mongo DB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/slots', require('./routes/slots'));
app.use('/api/booking', require('./routes/booking'));
//payment routes
app.use("/api/payment", paymentRoutes);
app.use('/api/booking', require('./routes/booking'));

// Add payment, admin routes similarly when ready

// Upload route and static folder for uploaded files
const uploadRouter = require('./routes/upload');
app.use('/api/upload', uploadRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


