const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/orders", async (req, res) => {
  const { user, items, total, status, date } = req.body;
  console.log(req.body);
  const order = await Order.create({ user, items, total, status, date });
  res.json({ message: "Order placed", order });
});

router.get("/orders", async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
});

router.put("/orders/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

router.put("/orders/:id/delivered", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Delivered" },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as delivered" });
  }
});

module.exports = router;