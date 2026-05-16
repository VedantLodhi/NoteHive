require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("EMAIL_USER:", process.env.EMAIL_USER);

console.log(
  "EMAIL_PASS exists:",
  !!process.env.EMAIL_PASS
);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",

  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((err) => {
  if (err) {
    console.log("❌ Email server error:", err);
  } else {
    console.log("✅ Email server ready");
  }
});

module.exports = transporter;