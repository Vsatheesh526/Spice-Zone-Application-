const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  state: { type: String },
  country: { type: String },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.models.City || mongoose.model("City", CitySchema);
