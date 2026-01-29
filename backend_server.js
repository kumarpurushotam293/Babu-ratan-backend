require('dotenv').config({ path: __dirname + '/.env' });
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
// require("dotenv").config();

const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const contactsRoutes = require("./routes/contacts");
const authRoutes = require("./routes/auth");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/admin", authRoutes);

// mongodb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
