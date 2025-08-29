const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// const { connectDB } = require("./config/db"); // <- agar use karna hai to neeche wala mongoose.connect() hata do

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: ["https://note-hive-nine.vercel.app"], // frontend live URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors()); // preflight requests

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
  res.send("🚀 Server is running!");
});

// ✅ MongoDB connect (keep only ONE version!)
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
