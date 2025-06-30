const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Get user profile by userId
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  const profile = await User.findOne({ userId });
  if (!profile) {
    return res.json({ profile: { name: "", email: "", address: "", image: "" }, orderCount: 0 });
  }
  res.json({ profile, orderCount: 0 });
});

// Update or create user profile by userId
router.post("/profile", async (req, res) => {
  const { userId, name, email, address, image } = req.body;
  const profile = await User.findOneAndUpdate(
    { userId },
    { name, email, address, image },
    { upsert: true, new: true }
  );
  res.json({ profile });
});

// Get user info by email
router.get("/me", async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ name: user.name, email: user.email });
});

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email already exists" });
  const hash = await bcrypt.hash(password, 10);
  // Correct way: use Mongoose model to create user
  const user = await User.create({ name, email, password: hash });
  res.json({ message: "Signup successful", user: { name: user.name, email: user.email } });
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
});




// 20-06-2025

router.get("/users", async (req, res) => {
  const users = await User.find({}); // Add createdAt here
  res.json(users);
});

// routes/User.js
router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// Update a user by ID
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;