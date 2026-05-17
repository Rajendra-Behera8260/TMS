const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Booking = require("../models/Booking");
const User = require("../models/User");

exports.getStats = async (req, res) => {
  try {
    const vehicles = await Vehicle.countDocuments();
    const drivers = await Driver.countDocuments();
    const bookings = await Booking.countDocuments();
    res.json({ vehicles, drivers, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email avatar status");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
