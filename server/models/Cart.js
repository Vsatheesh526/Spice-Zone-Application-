const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  cart: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("Cart", CartSchema);