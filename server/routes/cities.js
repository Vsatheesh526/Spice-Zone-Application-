const express = require("express");
const City = require("../models/Cities");
const router = express.Router();

// Get all cities
router.get("/", async (req, res) => {
  try {
    const cities = await City.find({ active: true });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

// Add a new city (admin only, simple version)
router.post("/add", async (req, res) => {
  try {
    const { name, displayName } = req.body;
    if (!name || !displayName) return res.status(400).json({ error: "Missing fields" });
    const city = new City({ name, displayName });
    await city.save();
    res.json({ message: "City added", city });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a city by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, state, country } = req.body;
    const updateFields = { name, state, country };
    const city = await City.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.json(city);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// (Optional) Delete or deactivate a city
router.delete("/:id", async (req, res) => {
  try {
    await City.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: "City deactivated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
