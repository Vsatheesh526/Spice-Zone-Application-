const express = require("express");
const Offer = require("../models/Offer");
const upload = require("../s3"); // S3 upload middleware
const router = express.Router();

// Add a new offer (with image upload to S3)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { label, mainText, subText, buttonText } = req.body;
    const image = req.file ? req.file.location : null; // S3 URL
    if (!image || !label || !mainText || !subText || !buttonText) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const offer = new Offer({ image, label, mainText, subText, buttonText });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    console.error("Error saving offer:", err);
    res.status(500).json({ error: "Failed to add offer" });
  }
});

// Get all offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// Delete an offer by ID
router.delete("/:id", async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// Update an offer (with optional image upload to S3)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { label, mainText, subText, buttonText } = req.body;
    const updateFields = { label, mainText, subText, buttonText };
    if (req.file && req.file.location) {
      updateFields.image = req.file.location; // S3 URL
    }
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!offer) return res.status(404).json({ error: "Offer not found" });
    res.json(offer);
  } catch (err) {
    console.error("OFFER UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update offer" });
  }
});

module.exports = router;