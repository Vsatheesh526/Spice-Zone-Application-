// server/models/Order.js
const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  user: String,
  items: Array,
  total: Number,
  status: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Order", OrderSchema);