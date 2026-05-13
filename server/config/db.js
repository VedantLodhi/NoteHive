const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

let db;
let client;

const connectDB = async () => {
  try {
    // First try DIRECT URI, otherwise SRV URI
    const mongoUri =
      process.env.MONGO_URI_DIRECT || process.env.MONGO_URI;

    // Check env variables
    if (!mongoUri) {
      console.error(
        "❌ Neither MONGO_URI nor MONGO_URI_DIRECT is set"
      );
      process.exit(1);
    }

    // Debug
    console.log(
      "Using Mongo URI:",
      mongoUri.startsWith("mongodb://")
        ? "DIRECT CONNECTION"
        : "SRV CONNECTION"
    );

    const clientOpts = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    // Native MongoDB connection
    client = new MongoClient(mongoUri, clientOpts);

    await client.connect();

    db = client.db();

    // Mongoose connection
    mongoose.set("strictQuery", true);

    await mongoose.connect(mongoUri, clientOpts);

    console.log(
      "✅ MongoDB Atlas Connected Successfully"
    );
  } catch (error) {
    console.error(
      "❌ MongoDB Atlas connection error:"
    );

    console.error(error);

    // SRV DNS issue
    if (
      error.code === "ECONNREFUSED" &&
      String(error.syscall || "").includes("querySrv")
    ) {
      console.error(`
❌ SRV DNS lookup failed.

Possible Fixes:
1. Use mobile hotspot
2. Turn VPN OFF
3. Use mongodb:// connection string
4. Check Atlas cluster is active
5. Add IP in Atlas Network Access
      `);
    }

    // Auth issue
    if (
      String(error.message || "")
        .toLowerCase()
        .includes("authentication")
    ) {
      console.error(`
❌ MongoDB Authentication Failed

Check:
- Username
- Password
- Database user permissions
      `);
    }

    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error(
      "Database not initialized. Call connectDB() first."
    );
  }

  return db;
};

module.exports = {
  connectDB,
  getDB,
};