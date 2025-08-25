const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { getDB } = require("../config/db")
const { ObjectId } = require("mongodb")
const { generateOTP, storeOTP, verifyOTP, sendOTPEmail } = require("../utils/otpUtils")

// Generate JWT Token
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is not set")
    throw new Error("Server configuration error")
  }
  return jwt.sign({ id: id.toString(), role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Initiate Registration with OTP
const initiateRegistration = async (req, res) => {
  const { username, email, password, role = "general" } = req.body

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." })
  }

  try {
    const db = getDB()
    if (!db) return res.status(500).json({ message: "Database connection error." })

    const usersCollection = db.collection("users")

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." })
    }

    // Generate and store OTP
    const otp = generateOTP()
    await storeOTP(email, otp, "registration")

    // Store user data temporarily
    const tempUsersCollection = db.collection("tempUsers")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Delete any existing temp user with this email
    await tempUsersCollection.deleteOne({ email })

    // Store new temp user
    await tempUsersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    })

    // Send OTP via email
    await sendOTPEmail(email, otp, "registration")

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete registration.",
      email,
    })
  } catch (error) {
    console.error("Registration initiation error:", error)
    return res.status(500).json({
      message: "Failed to initiate registration.",
      error: error.message,
    })
  }
}

// Verify OTP and Complete Registration
const verifyRegistrationOTP = async (req, res) => {
  const { email, otp } = req.body

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." })
  }

  try {
    // Verify OTP
    const isValid = await verifyOTP(email, otp, "registration")
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP." })
    }

    const db = getDB()
    if (!db) return res.status(500).json({ message: "Database connection error." })

    // Get temp user data
    const tempUsersCollection = db.collection("tempUsers")
    const tempUser = await tempUsersCollection.findOne({ email })

    if (!tempUser) {
      return res.status(400).json({ message: "Registration session expired. Please try again." })
    }

    // Move user from temp to permanent collection
    const usersCollection = db.collection("users")
    const result = await usersCollection.insertOne({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      loggedIn: false,
      createdAt: new Date(),
    })

    // Delete temp user
    await tempUsersCollection.deleteOne({ email })

    return res.status(201).json({
      message: "Registration successful!",
      username: tempUser.username,
      userId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    return res.status(500).json({
      message: "Failed to verify OTP.",
      error: error.message,
    })
  }
}

// Initiate Login with OTP
const initiateLogin = async (req, res) => {
  const { email } = req.body

  // Validate input
  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  try {
    const db = getDB()
    if (!db) return res.status(500).json({ message: "Database connection error." })

    const usersCollection = db.collection("users")

    // Check if user exists
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "No account found with this email." })
    }

    // Generate and store OTP
    const otp = generateOTP()
    await storeOTP(email, otp, "login")

    // Send OTP via email
    await sendOTPEmail(email, otp, "login")

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete login.",
      email,
    })
  } catch (error) {
    console.error("Login initiation error:", error)
    return res.status(500).json({
      message: "Failed to initiate login.",
      error: error.message,
    })
  }
}

// Verify OTP and Complete Login
const verifyLoginOTP = async (req, res) => {
  const { email, otp, password } = req.body

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." })
  }

  try {
    // Verify OTP
    const isValid = await verifyOTP(email, otp, "login")
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP." })
    }

    const db = getDB()
    if (!db) return res.status(500).json({ message: "Database connection error." })

    const usersCollection = db.collection("users")

    // Get user
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "No account found with this email." })
    }

    // Verify password if provided
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password." })
      }
    }

    // Update login status
    await usersCollection.updateOne({ email }, { $set: { loggedIn: true } })

    // Generate token
    const token = generateToken(user._id, user.role)

    return res.status(200).json({
      message: "Login successful!",
      username: user.username,
      role: user.role,
      token,
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    return res.status(500).json({
      message: "Failed to verify OTP.",
      error: error.message,
    })
  }
}

// Original register function (kept for backward compatibility)
const register = async (req, res) => {
  const { username, email, password, role = "general" } = req.body

  try {
    const db = getDB()
    if (!db) return res.status(500).json({ message: "Database connection error." })

    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { username, email, password: hashedPassword, role, loggedIn: false }

    const result = await usersCollection.insertOne(newUser)
    console.log("Inserted User:", result)
    return res.status(201).json({
      message: "Registration successful!",
      username: newUser.username,
      userId: result.insertedId.toString(),
    })
  } catch (error) {
    return res.status(500).json({ message: "Registration failed.", error: error.message })
  }
}

// Original login function (kept for backward compatibility)
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    console.log("Received login request:", { email, password: password ? "Provided" : "Not Provided" })

    const db = getDB()
    if (!db) return res.status(500).json({ message: "Database connection error." })

    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ email })
    console.log("User found in DB:", user)
    if (!user) {
      console.warn("No account found for email:", email)
      return res.status(400).json({ message: "No account found with this email." })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log("Password Match:", isPasswordValid)

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password." })
    }

    await usersCollection.updateOne({ email }, { $set: { loggedIn: true } })

    const token = generateToken(user._id, user.role)
    console.log("Generated Token:", token)

    return res.status(200).json({
      message: "Login successful!",
      username: user.username,
      role: user.role,
      token,
    })
  } catch (error) {
    console.error("Login Error:", error)
    return res.status(500).json({ message: "Login failed.", error: error.message })
  }
}

// Logout User
const logout = async (req, res) => {
  try {
    const db = getDB()
    if (!db) return res.status(500).json({ message: "Database connection error." })

    const usersCollection = db.collection("users")

    // Ensure _id is an ObjectId
    await usersCollection.updateOne({ _id: new ObjectId(req.user.id) }, { $set: { loggedIn: false } })

    return res.status(200).json({ message: "Logout successful!" })
  } catch (error) {
    return res.status(500).json({ message: "Logout failed.", error: error.message })
  }
}

// Resend OTP
const resendOTP = async (req, res) => {
  const { email, purpose } = req.body

  if (!email || !purpose || !["registration", "login"].includes(purpose)) {
    return res.status(400).json({ message: "Invalid request. Email and valid purpose required." })
  }

  try {
    const db = getDB()
    if (!db) return res.status(500).json({ message: "Database connection error." })

    // For registration, check if temp user exists
    if (purpose === "registration") {
      const tempUsersCollection = db.collection("tempUsers")
      const tempUser = await tempUsersCollection.findOne({ email })

      if (!tempUser) {
        return res.status(400).json({ message: "Registration session expired. Please start again." })
      }
    }

    // For login, check if user exists
    if (purpose === "login") {
      const usersCollection = db.collection("users")
      const user = await usersCollection.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: "No account found with this email." })
      }
    }

    // Generate and store new OTP
    const otp = generateOTP()
    await storeOTP(email, otp, purpose)

    // Send OTP via email
    await sendOTPEmail(email, otp, purpose)

    return res.status(200).json({
      message: "OTP resent to your email.",
      email,
    })
  } catch (error) {
    console.error("OTP resend error:", error)
    return res.status(500).json({
      message: "Failed to resend OTP.",
      error: error.message,
    })
  }
}

module.exports = {
  register,
  login,
  logout,
  initiateRegistration,
  verifyRegistrationOTP,
  initiateLogin,
  verifyLoginOTP,
  resendOTP,
}
