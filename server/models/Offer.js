const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  image: String,
  label: String,
  mainText: String,
  subText: String,
  buttonText: String
});

module.exports = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);