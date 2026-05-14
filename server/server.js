const dns = require("dns");

// Helps MongoDB Atlas on some networks
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",

  // Production frontend
  "https://note-hive-nine.vercel.app",
];

// ✅ Proper CORS setup
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
    "Cache-Control",
    "X-Access-Token",
  ],
};

app.use(cors(corsOptions));

// ✅ Handle preflight correctly
app.options("*", cors(corsOptions));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notesRoutes = require("./routes/notesRoutes");
const triviaRoutes = require("./routes/triviaRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", notesRoutes);
app.use("/api", triviaRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Server is running!",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong!",
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    console.log("✅ Database connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
};

startServer();