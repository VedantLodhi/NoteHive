require("dotenv").config();

const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter on server startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

module.exports = transporter;