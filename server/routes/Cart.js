const express = require("express");
const Cart = require("../models/Cart");
const router = express.Router();

// Save or update cart
router.post("/", async (req, res) => {
  const { userId, cart } = req.body;
  try {
    const savedCart = await Cart.findOneAndUpdate(
      { userId },
      { cart },
      { upsert: true, new: true }
    );
    res.json(savedCart);
  } catch (err) {
    res.status(500).json({ error: "Failed to save cart" });
  }
});

// Get cart for a user
router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const cart = await Cart.findOne({ userId });
    res.json(cart || { cart: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

module.exports = router;