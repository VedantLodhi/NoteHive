const { MongoClient } = require("mongodb")
require("dotenv").config()

let db // To store the database connection

const connectDB = async () => {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI environment variable is not set")
      process.exit(1)
    }

    const client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    await client.connect()

    // Use DB_NAME from environment or default to "notehive"
    const dbName = process.env.DB_NAME || "notehive"
    db = client.db(dbName)

    console.log("✅ MongoDB Connected")
    return db
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1) // Exit process if connection fails
  }
}

// Function to get the database instance
const getDB = () => {
  if (!db) {
    console.warn("Database not initialized. Attempting to connect...")
    return null // Return null to allow the caller to handle this case
  }
  return db
}

module.exports = { connectDB, getDB }
