/**
 * Quick Mongo connectivity check (same env vars as the app).
 * Run from repo root: node server/scripts/checkMongoConnection.js
 * Or from server: node scripts/checkMongoConnection.js
 */
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});

const dns = require("dns");
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const { MongoClient } = require("mongodb");

const opts = {
  serverSelectionTimeoutMS: 15000,
  family: 4,
};

async function tryUri(label, uri) {
  if (!uri?.trim()) return false;
  process.stdout.write(`${label} … `);
  const client = new MongoClient(uri.trim(), opts);
  try {
    await client.connect();
    await client.db().admin().ping();
    await client.close();
    console.log("OK");
    return true;
  } catch (e) {
    try {
      await client.close();
    } catch (_) {}
    console.log("FAILED");
    console.error(`   ${e.name}: ${e.message}`);
    if (e.code) console.error(`   code: ${e.code}`);
    return false;
  }
}

async function main() {
  console.log("MongoDB connection check\n");

  const srv = process.env.MONGO_URI?.trim();
  const direct = process.env.MONGO_URI_DIRECT?.trim();

  if (!srv && !direct) {
    console.error("No MONGO_URI or MONGO_URI_DIRECT in server/.env");
    process.exit(1);
  }

  let ok = false;
  if (srv) ok = (await tryUri("MONGO_URI (mongodb+srv)", srv)) || ok;
  if (direct) ok = (await tryUri("MONGO_URI_DIRECT (mongodb://)", direct)) || ok;

  console.log("");
  if (ok) {
    console.log("At least one URI works. You can run: npm start (in server/)");
    process.exit(0);
  }

  console.log("Neither URI connected. Fix .env, Atlas Network Access, user/password, then retry.");
  process.exit(1);
}

main();
