const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  phone: String,
  license: String,
  vehicle: { type: String, default: "Unassigned" },
  status: { type: String, default: "active" }
});

module.exports = mongoose.model("Driver", driverSchema);
