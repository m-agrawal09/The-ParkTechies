const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'host', 'admin'], required: true },
  aadhar: String,
});

module.exports = mongoose.model('User', UserSchema);
