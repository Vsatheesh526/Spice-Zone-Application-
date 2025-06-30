const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  profileImage: { type: String }, // store image path or URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);