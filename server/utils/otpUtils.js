const nodemailer = require("nodemailer")
const { getDB } = require("../config/db")
const emailConfig = require("../config/email")

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTP in database with expiration
const storeOTP = async (email, otp, purpose) => {
  try {
    const db = getDB()
    if (!db) throw new Error("Database connection error")

    const otpCollection = db.collection("otps")
    
    // Delete any existing OTP for this email and purpose
    await otpCollection.deleteMany({ email, purpose })

    // Store new OTP with 10 minutes expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    
    await otpCollection.insertOne({
      email,
      otp,
      purpose,
      createdAt: new Date(),
      expiresAt
    })

    console.log(`OTP stored for ${email}: ${otp} (Purpose: ${purpose})`)
    return true
  } catch (error) {
    console.error("Error storing OTP:", error)
    throw error
  }
}

// Verify OTP
const verifyOTP = async (email, otp, purpose) => {
  try {
    const db = getDB()
    if (!db) throw new Error("Database connection error")

    const otpCollection = db.collection("otps")
    
    const otpRecord = await otpCollection.findOne({
      email,
      otp,
      purpose,
      expiresAt: { $gt: new Date() } // Check if not expired
    })

    if (otpRecord) {
      // Delete the OTP after successful verification
      await otpCollection.deleteOne({ _id: otpRecord._id })
      console.log(`OTP verified and deleted for ${email}`)
      return true
    }

    console.log(`OTP verification failed for ${email}`)
    return false
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}

// Send OTP via email
// const sendOTPEmail = async (email, otp, purpose) => {
//   try {
//     console.log("Email config:", emailConfig)
//     console.log(`Attempting to send OTP ${otp} to ${email} for ${purpose}`)

//     // Create transporter
//     const transporter = nodemailer.createTransport(emailConfig)

//     // Verify transporter configuration
//     await transporter.verify()
//     console.log("Email transporter verified successfully")

//     // Email subject and content based on purpose
//     let subject, html
    
//     if (purpose === "registration") {
//       subject = "Complete Your Registration - OTP Verification"
//       html = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h2 style="color: #333; text-align: center;">Welcome! Complete Your Registration</h2>
//           <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <p style="font-size: 16px; margin-bottom: 10px;">Your verification code is:</p>
//             <div style="font-size: 32px; font-weight: bold; color: #007bff; text-align: center; letter-spacing: 5px; padding: 15px; background-color: white; border-radius: 4px;">
//               ${otp}
//             </div>
//           </div>
//           <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
//           <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
//         </div>
//       `
//     } else if (purpose === "login") {
//       subject = "Login Verification - OTP Code"
//       html = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h2 style="color: #333; text-align: center;">Login Verification</h2>
//           <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <p style="font-size: 16px; margin-bottom: 10px;">Your login verification code is:</p>
//             <div style="font-size: 32px; font-weight: bold; color: #28a745; text-align: center; letter-spacing: 5px; padding: 15px; background-color: white; border-radius: 4px;">
//               ${otp}
//             </div>
//           </div>
//           <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
//           <p style="color: #666; font-size: 14px;">If you didn't request this, please secure your account immediately.</p>
//         </div>
//       `
//     } else {
//       subject = "Verification Code"
//       html = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h2 style="color: #333; text-align: center;">Verification Code</h2>
//           <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <p style="font-size: 16px; margin-bottom: 10px;">Your verification code is:</p>
//             <div style="font-size: 32px; font-weight: bold; color: #333; text-align: center; letter-spacing: 5px; padding: 15px; background-color: white; border-radius: 4px;">
//               ${otp}
//             </div>
//           </div>
//           <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
//         </div>
//       `
//     }

//     // Email options
//     const mailOptions = {
//       from: `"Your App" <${emailConfig.auth.user}>`,
//       to: email,
//       subject: subject,
//       html: html
//     }

//     // Send email
//     const result = await transporter.sendMail(mailOptions)
//     console.log("Email sent successfully:", result.messageId)
//     console.log("Preview URL:", nodemailer.getTestMessageUrl(result))
    
//     return true
//   } catch (error) {
//     console.error("Error sending OTP email:", error)
    
//     // More detailed error logging
//     if (error.code === 'EAUTH') {
//       console.error("Authentication failed. Check your email credentials.")
//     } else if (error.code === 'ESOCKET') {
//       console.error("Network error. Check your internet connection.")
//     } else if (error.responseCode === 534) {
//       console.error("Gmail security: Use app-specific password or enable less secure apps.")
//     }
    
//     throw error
//   }
// }
const sendOTPEmail = async (email, otp, purpose) => {
  try {
    // If SMTP creds are missing, fall back to console log (dev mode)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("EMAIL_USER/EMAIL_PASSWORD not set. Falling back to console OTP log.")
      console.log(`🔥 OTP FOR ${email}: ${otp} (Purpose: ${purpose})`)
      return { success: true, mocked: true }
    }

    const transporter = nodemailer.createTransport(emailConfig)
    await transporter.verify()

    let subject
    const accent = purpose === 'login' ? '#22c55e' : '#3b82f6'
    if (purpose === 'registration') subject = 'Complete Your Registration - OTP Verification'
    else if (purpose === 'login') subject = 'Login Verification - OTP Code'
    else subject = 'Verification Code'

    const html = `
      <div style="font-family: Inter,Arial,sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#111827; text-align:center; margin:0 0 12px;">${subject}</h2>
        <div style="background:#f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="font-size:16px; color:#374151; margin:0 0 8px;">Your one-time code is:</p>
          <div style="font-size:36px; font-weight:800; color:${accent}; text-align:center; letter-spacing: 6px; padding: 16px; background:#ffffff; border-radius: 10px;">
            ${otp}
          </div>
        </div>
        <p style="color:#6b7280; font-size:14px; margin:0 0 4px;">This code will expire in 10 minutes.</p>
        <p style="color:#6b7280; font-size:12px;">If you didn’t request this, you can ignore this email.</p>
      </div>
    `

    const mailOptions = {
      from: `"NoteHive" <${emailConfig.auth.user}>`,
      to: email,
      subject,
      html
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("📧 OTP email sent:", result.messageId)
    return { success: true, id: result.messageId }
  } catch (error) {
    console.error('Error in sendOTPEmail:', error)
    if (error.code === 'EAUTH') console.error('Authentication failed. Use Gmail App Password for EMAIL_PASSWORD.')
    if (error.code === 'ESOCKET') console.error('Network/SMTP socket error.')
    if (error.responseCode === 534) console.error('Gmail 534: Use app-specific password or update security settings.')
    // Graceful fallback so login/registration flow continues in dev
    console.warn('Falling back to console OTP due to email error.')
    console.log(`🔥 OTP FOR ${email}: ${otp} (Purpose: ${purpose})`)
    return { success: true, mocked: true }
  }
};
module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTPEmail
}