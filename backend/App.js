
"use strict";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//config imports
//const corsOptions = require("./config/corsOptions");

//Import Routes
const authRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoute = require('./routes/orderRoutes')

//Import Middlewares
const notFound = require("./middleware/routeNotFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200,
    message: {
      success: false,
      message: "Too many requests, please try again later.",
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoute)

app.use(notFound);
app.use(errorHandler);

module.exports = app;
