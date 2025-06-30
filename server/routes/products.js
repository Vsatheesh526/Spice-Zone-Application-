const express = require("express");
const Product = require("../models/Product");
const upload = require("../s3"); // import S3 upload middleware
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Use S3 upload middleware for product image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, rating, description } = req.body;
    const image = req.file ? req.file.location : null; // S3 URL
    const product = new Product({ name, price, rating, description, image });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error("PRODUCT UPLOAD ERROR:", err); // Log the real error
    res.status(500).json({ error: "Error saving product" });
  }
});

// Update a product (with optional image upload to S3)
router.put("/:id", upload.single("image"), async (req, res) => {
  console.log("[PUT /products/:id]", req.method, req.originalUrl);
  console.log("Body:", req.body);
  if (req.file) {
    console.log("File uploaded:", req.file);
  }
  try {
    const { name, price, rating, description } = req.body;
    const updateFields = { name, price, rating, description };
    if (req.file && req.file.location) {
      updateFields.image = req.file.location; // S3 URL
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("PRODUCT UPDATE ERROR:", err);
    res.status(500).json({ error: "Error updating product" });
  }
});

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;