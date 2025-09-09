const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'host', 'admin'], required: true },
  aadhar: { type: String, required: true },
  phone: { type: String, required: true },  // ✅ now required
});

module.exports = mongoose.model('User', UserSchema);
