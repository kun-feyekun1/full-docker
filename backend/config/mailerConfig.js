
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // 587
  secure: false, // must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // prevents socket closing
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("Email transporter error:", err);
  } else {
    console.log("Email transporter ready");
  }
});

module.exports = transporter;
