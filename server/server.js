const dns = require("dns");
// Helps MongoDB Atlas (mongodb+srv) on Windows / some networks where IPv6 SRV lookups fail.
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");

dotenv.config();
const app = express();

// ✅ Simple CORS for local development
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "Origin", 
    "X-Requested-With", 
    "Accept",
    "Cache-Control",
    "X-Access-Token"
  ]
}));

// ✅ Handle preflight requests
app.options("*", cors());

// ✅ Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notesRoutes = require("./routes/notesRoutes");
const triviaRoutes = require("./routes/triviaRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", notesRoutes);
app.use("/api", triviaRoutes);

// ✅ Root test route
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Server is running!", 
    endpoints: [
      "/api/auth/initiate-registration",
      "/api/auth/verify-registration-otp",
      "/api/auth/initiate-login", 
      "/api/auth/verify-login-otp"
    ]
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// ✅ Start server with database connection
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📧 Make sure your .env has EMAIL_USER and EMAIL_PASSWORD set`);
      console.log(`🔗 Test endpoint: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();