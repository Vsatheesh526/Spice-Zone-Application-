const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const upload = require("../s3"); // Use S3 upload middleware
const path = require("path");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key"; // Use a strong secret in production

// Signup route
router.post("/signup", upload.single("profileImage"), async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let profileImageUrl = "";
    if (req.file) {
      profileImageUrl = req.file.location; // S3 URL
    }
    const user = new User({ name, email, password: hashedPassword, profileImageUrl });
    await user.save();
    // Create JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Signup successful", profileImageUrl, token, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    // Create JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", user: { name: user.name, email: user.email, profileImageUrl: user.profileImageUrl }, token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;