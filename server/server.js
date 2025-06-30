const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const port = process.env.PORT || 5000;  

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/spicezone");

const userProfileRouter = require("./routes/UserProfile");
app.use("/api/userprofile", userProfileRouter);

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

const adminRoutes = require('./routes/adminAuth');
app.use('/api/admin', adminRoutes);

const offersRouter = require("./routes/Offers");
app.use("/api/offers", offersRouter);

const productsRouter = require("./routes/products");
app.use("/api/products", productsRouter);

const cartRouter = require("./routes/Cart");
app.use("/api/cart", cartRouter);


app.get("/", (req, res) => {
  res.send("Server is running");
});

const userRouter = require("./routes/User");
const { useEffect } = require("react");
app.use("/api", userRouter);

const orderRouter = require("./routes/Orders");
app.use("/api", orderRouter);

const adminProfileRouter = require("./routes/AdminProfile");
app.use("/api/adminprofile", adminProfileRouter);

const citiesRouter = require("./routes/cities");
app.use("/api/cities", citiesRouter);



app.listen(5000, () => console.log("Server running on port 5000"));


