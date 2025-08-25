const crypto = require("crypto")
const nodemailer = require("nodemailer")
const { getDB } = require("../config/db")
require("dotenv").config()

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTP in database with expiration time (10 minutes)
const storeOTP = async (email, otp, purpose) => {
  try {
    const db = getDB()
    if (!db) throw new Error("Database connection error.")

    const otpCollection = db.collection("otps")

    // Delete any existing OTPs for this email and purpose
    await otpCollection.deleteMany({ email, purpose })

    // Store new OTP with expiration time
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // 10 minutes expiration

    await otpCollection.insertOne({
      email,
      otp,
      purpose, // 'registration' or 'login'
      expiresAt,
      createdAt: new Date(),
    })

    return true
  } catch (error) {
    console.error("Error storing OTP:", error)
    throw error
  }
}

// Verify OTP from database
const verifyOTP = async (email, otp, purpose) => {
  try {
    const db = getDB()
    if (!db) throw new Error("Database connection error.")

    const otpCollection = db.collection("otps")

    const otpRecord = await otpCollection.findOne({
      email,
      otp,
      purpose,
      expiresAt: { $gt: new Date() }, // Check if OTP hasn't expired
    })

    if (!otpRecord) {
      return false
    }

    // Delete the OTP after successful verification
    await otpCollection.deleteOne({ _id: otpRecord._id })

    return true
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return false
  }
}

// Send OTP via email
const sendOTPEmail = async (email, otp, purpose) => {
  try {
    // Check if email credentials are available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Email credentials are missing. Check your environment variables.")

      // For development/testing only - log the OTP instead of sending email
      console.log(`[DEV MODE] OTP for ${email}: ${otp}`)
      return true
    }

    // Create a transporter with more detailed configuration
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE || false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password here
      },
      debug: true, // Show debug output
      logger: true, // Log information into the console
    })

    // Verify transporter configuration
    try {
      await transporter.verify()
      console.log("SMTP connection verified successfully")
    } catch (error) {
      console.error("Transporter verification failed:", error)

      // For development/testing - log the OTP and continue
      console.log(`[DEV MODE - FALLBACK] OTP for ${email}: ${otp}`)
      return true
    }

    const subject = purpose === "registration" ? "Your Registration OTP Code" : "Your Login OTP Code"

    const message =
      purpose === "registration"
        ? `Thank you for registering with our service. Your OTP code is: ${otp}. This code will expire in 10 minutes.`
        : `Your login OTP code is: ${otp}. This code will expire in 10 minutes.`

    // Send email
    const mailOptions = {
      from: `"NoteHive" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">${subject}</h2>
          <p style="font-size: 16px; color: #555;">Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; margin: 0; color: #333;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #777;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending OTP email:", error)

    // For development/testing only - log the OTP instead of failing
    console.log(`[DEV MODE - FALLBACK] OTP for ${email}: ${otp}`)
    return true // Return true to allow the flow to continue in development
  }
}

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTPEmail,
}
