const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const upload = require("../s3"); // Use S3 upload middleware
const router = express.Router();

router.post("/signup", upload.single('profileImage'), async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let profileImagePath = req.file ? req.file.location : undefined; // S3 URL
  try {
    const admin = new Admin({ email, password: hashedPassword, name, profileImage: profileImagePath });
    await admin.save();
    res.json({ message: "Admin signup successful" });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(400).json({ error: "Signup failed" });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ error: "Invalid credentials" });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  const token = jwt.sign({ adminId: admin._id }, "secretkey");
  res.json({ message: "Login successful", token });
});

module.exports = router;