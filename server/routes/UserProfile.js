const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  const profile = await User.findOne({ userId });
  if (!profile) return res.json({ profile: { name: "", email: "", address: "", image: "" }, orderCount: 0 });
  res.json({ profile, orderCount: 0 });
});

router.post("/profile", async (req, res) => {
  const { userId, name, email, address, image } = req.body;
  const profile = await User.findOneAndUpdate(
    { userId },
    { name, email, address, image },
    { upsert: true, new: true }
  );
  res.json({ profile });
});

router.get("/me", async (req, res) => {
  // You can get userId from req.query, req.body, or from a decoded JWT
  const { userId, email } = req.query;
  let user;
  if (userId) {
    user = await User.findById(userId);
  } else if (email) {
    user = await User.findOne({ email });
  }
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ name: user.name, email: user.email });
});



module.exports = router;