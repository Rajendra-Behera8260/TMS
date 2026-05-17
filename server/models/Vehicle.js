const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  number: String,
  type: String,
  capacity: Number,
  status: { type: String, default: "available" }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);