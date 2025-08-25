const express = require("express")
const router = express.Router()
const {
  register,
  login,
  logout,
  initiateRegistration,
  verifyRegistrationOTP,
  initiateLogin,
  verifyLoginOTP,
  resendOTP,
} = require("../controllers/authController")
const { authMiddleware } = require("../middlewares/authMiddleware")

// OTP-based authentication routes
router.post("/initiate-registration", initiateRegistration)
router.post("/verify-registration", verifyRegistrationOTP)
router.post("/initiate-login", initiateLogin)
router.post("/verify-login", verifyLoginOTP)
router.post("/resend-otp", resendOTP)

// Original authentication routes (kept for backward compatibility)
router.post("/register", register)
router.post("/login", login)
router.post("/logout", authMiddleware, logout)

module.exports = router
