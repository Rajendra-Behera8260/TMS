const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    passengerName: { type: String, required: true, trim: true },
    pickupLocation: { type: String, required: true, trim: true },
    dropLocation: { type: String, required: true, trim: true },
    travelDate: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      default: "cash",
      required: true,
    },
    notes: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "assigned", "completed", "cancelled"],
      default: "pending",
    },
    confirmationSentAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
