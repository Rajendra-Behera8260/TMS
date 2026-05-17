// config/db.js
const mongoose = require("mongoose");

const isSrvDnsError = (error) =>
  error &&
  error.syscall === "querySrv" &&
  ["ECONNREFUSED", "ETIMEOUT", "ENOTFOUND"].includes(error.code);

const logConnectionHelp = (uri, error) => {
  console.error("MongoDB connection error:", error.message);

  if (isSrvDnsError(error) && uri?.startsWith("mongodb+srv://")) {
    console.error(
      "Atlas DNS lookup failed for your mongodb+srv URI. This is usually a local DNS, VPN, firewall, or network issue."
    );
    console.error(
      "Set MONGO_URI to a working non-SRV MongoDB URI, or fix DNS resolution for MongoDB Atlas SRV records."
    );
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tmsdb";

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error) {
    logConnectionHelp(mongoUri, error);
    process.exit(1);
  }
};

module.exports = connectDB;
