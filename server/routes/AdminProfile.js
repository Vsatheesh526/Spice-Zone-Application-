const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const upload = require("../s3"); // Use S3 upload middleware
const router = express.Router();

// Middleware to authenticate admin via JWT
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.adminId = decoded.adminId;
    next();
  });
}

// Get admin profile
router.get("/me", authenticateAdmin, async (req, res) => {
  const admin = await Admin.findById(req.adminId);
  if (!admin) return res.status(404).json({ error: "Admin not found" });
  res.json({
    email: admin.email,
    name: admin.name || "",
    profileImage: admin.profileImage || "",
    createdAt: admin.createdAt
  });
});

// Update admin profile (name and profile image)
router.put("/profile", authenticateAdmin, upload.single('profileImage'), async (req, res) => {
  const { name } = req.body;
  let updateData = { name };
  if (req.file) {
    updateData.profileImage = req.file.location; // S3 URL
  }
  const admin = await Admin.findByIdAndUpdate(
    req.adminId,
    updateData,
    { new: true }
  );
  if (!admin) return res.status(404).json({ error: "Admin not found" });
  res.json({
    email: admin.email,
    name: admin.name || "",
    profileImage: admin.profileImage || "",
    createdAt: admin.createdAt
  });
});

// Add City (admin only)
router.post("/add-city", authenticateAdmin, async (req, res) => {
  try {
    const { name, state, country } = req.body;
    if (!name || !state || !country) return res.status(400).json({ error: "All fields (name, state, country) are required." });
    const City = require("../models/Cities");
    const city = new City({ name, state, country });
    await city.save();
    res.json({ message: "City added", city });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
