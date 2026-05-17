const Booking = require("../models/Booking");
const Route = require("../models/Route");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    const {
      route,
      passengerName,
      pickupLocation,
      dropLocation,
      travelDate,
      paymentMethod = "cash",
      notes = "",
    } = req.body;

    if (!route || !passengerName || !pickupLocation || !dropLocation || !travelDate || !paymentMethod) {
      return res.status(400).json({ message: "All booking fields are required" });
    }

    if (!["online", "cash"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Please select a valid payment method" });
    }

    const selectedRoute = await Route.findById(route);
    if (!selectedRoute || selectedRoute.status !== "active") {
      return res.status(400).json({ message: "Selected route is not available" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.create({
      user: user._id,
      route: selectedRoute._id,
      passengerName: passengerName.trim(),
      pickupLocation: pickupLocation.trim(),
      dropLocation: dropLocation.trim(),
      travelDate,
      paymentMethod,
      notes: notes.trim(),
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("route", "source destination distance duration status")
      .populate("vehicle", "name number type status")
      .populate("driver", "name phone license status vehicle");

    res.status(201).json({
      message: "Booking created successfully. Waiting for admin confirmation.",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to create booking" });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("route", "source destination distance duration status")
      .populate("vehicle", "name number type status")
      .populate("driver", "name phone license status vehicle");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Unable to load bookings" });
  }
};
