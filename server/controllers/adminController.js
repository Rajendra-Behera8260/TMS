const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const Route = require("../models/Route");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const {
  createMailTransporter,
  formatMailError,
} = require("../utils/mailer");
const {
  clearAdminCookie,
  createAdminToken,
  getAdminCredentials,
  setAdminCookie,
} = require("../middleware/adminAuth");

const buildViewModel = (overrides = {}) => ({
  pageTitle: "Admin Dashboard",
  currentPath: "/admin/dashboard",
  adminEmail: getAdminCredentials().email,
  error: "",
  success: "",
  stats: {},
  drivers: [],
  vehicles: [],
  routes: [],
  bookings: [],
  routeOptions: [],
  vehicleOptions: [],
  driverOptions: [],
  ...overrides,
});

const sendBookingConfirmationEmail = async (booking) => {
  const transporter = createMailTransporter();

  if (!transporter || !booking?.user?.email) {
    return false;
  }

  await transporter.sendMail({
    from: process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER,
    to: booking.user.email,
    subject: "Your TMS booking has been confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:24px;">
        <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(135deg,#2563eb,#0f172a); color:#ffffff; padding:24px;">
            <h1 style="margin:0; font-size:24px;">Booking Confirmed</h1>
            <p style="margin:8px 0 0; opacity:0.9;">Transport Management System</p>
          </div>
          <div style="padding:24px; color:#334155; line-height:1.7;">
            <p>Hello ${booking.user.name || booking.passengerName},</p>
            <p>Your booking has been confirmed by the admin team.</p>
            <ul style="padding-left:20px;">
              <li><strong>Passenger:</strong> ${booking.passengerName}</li>
              <li><strong>Route:</strong> ${booking.route?.source || "-"} to ${booking.route?.destination || "-"}</li>
              <li><strong>Date:</strong> ${new Date(booking.travelDate).toLocaleDateString("en-IN")}</li>
              <li><strong>Payment:</strong> ${booking.paymentMethod === "online" ? "Online Payment" : "Cash"}</li>
              <li><strong>Vehicle:</strong> ${booking.vehicle?.number || "Will be assigned soon"}</li>
              <li><strong>Driver:</strong> ${booking.driver?.name || "Will be assigned soon"}</li>
              <li><strong>Status:</strong> ${booking.status}</li>
            </ul>
            <p>Please log in to your dashboard to track the booking status.</p>
          </div>
        </div>
      </div>
    `,
  });

  return true;
};

exports.renderLogin = (req, res) => {
  res.render("admin/login", buildViewModel({ pageTitle: "Admin Login" }));
};

exports.login = (req, res) => {
  const { email = "", password = "" } = req.body;
  const adminCredentials = getAdminCredentials();

  if (!adminCredentials.isConfigured) {
    return res.status(500).render(
      "admin/login",
      buildViewModel({
        pageTitle: "Admin Login",
        error: "Admin credentials are not configured on the server.",
      })
    );
  }

  if (
    email.trim().toLowerCase() !== adminCredentials.email ||
    password.trim() !== adminCredentials.password
  ) {
    return res.status(401).render(
      "admin/login",
      buildViewModel({
        pageTitle: "Admin Login",
        error: "Invalid admin email or password.",
      })
    );
  }

  const token = createAdminToken(adminCredentials.email);
  setAdminCookie(res, token);
  return res.redirect("/admin/dashboard");
};

exports.logout = (req, res) => {
  clearAdminCookie(res);
  return res.redirect("/admin/login");
};

exports.renderDashboard = async (req, res) => {
  const [drivers, vehicles, routes, bookings, totalDrivers, activeDrivers, totalVehicles, activeVehicles, totalRoutes, totalBookings] = await Promise.all([
    Driver.find().sort({ _id: -1 }).limit(5),
    Vehicle.find().sort({ _id: -1 }).limit(5),
    Route.find().sort({ _id: -1 }).limit(5),
    Booking.find().sort({ _id: -1 }).limit(5).populate("route", "source destination").populate("user", "name email"),
    Driver.countDocuments(),
    Driver.countDocuments({ status: { $in: ["active", "available", "Available", "on trip", "On Trip"] } }),
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: { $in: ["available", "active", "Active"] } }),
    Route.countDocuments(),
    Booking.countDocuments(),
  ]);

  return res.render(
    "admin/dashboard",
    buildViewModel({
      currentPath: "/admin/dashboard",
      stats: { totalDrivers, activeDrivers, totalVehicles, activeVehicles, totalRoutes, totalBookings },
      drivers,
      vehicles,
      routes,
      bookings,
    })
  );
};

exports.renderDrivers = async (req, res) => {
  const drivers = await Driver.find().sort({ _id: -1 });
  return res.render("admin/drivers", buildViewModel({ pageTitle: "Manage Drivers", currentPath: "/admin/drivers", drivers, success: req.query.success || "", error: req.query.error || "" }));
};

exports.createDriver = async (req, res) => {
  try {
    const { name = "", phone = "", license = "", vehicle = "", status = "active" } = req.body;
    if (!name.trim() || !phone.trim() || !license.trim()) {
      return res.redirect("/admin/drivers?error=All driver fields are required");
    }
    await Driver.create({ name: name.trim(), phone: phone.trim(), license: license.trim(), vehicle: vehicle.trim() || "Unassigned", status: status.trim() || "active" });
    return res.redirect("/admin/drivers?success=Driver added successfully");
  } catch {
    return res.redirect(`/admin/drivers?error=${encodeURIComponent("Unable to add driver")}`);
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const { name = "", phone = "", license = "", vehicle = "", status = "active" } = req.body;
    await Driver.findByIdAndUpdate(req.params.id, { name: name.trim(), phone: phone.trim(), license: license.trim(), vehicle: vehicle.trim() || "Unassigned", status: status.trim() || "active" });
    return res.redirect("/admin/drivers?success=Driver updated successfully");
  } catch {
    return res.redirect(`/admin/drivers?error=${encodeURIComponent("Unable to update driver")}`);
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/drivers?success=Driver deleted successfully");
  } catch {
    return res.redirect(`/admin/drivers?error=${encodeURIComponent("Unable to delete driver")}`);
  }
};

exports.renderVehicles = async (req, res) => {
  const vehicles = await Vehicle.find().sort({ _id: -1 });
  return res.render("admin/vehicles", buildViewModel({ pageTitle: "Manage Vehicles", currentPath: "/admin/vehicles", vehicles, success: req.query.success || "", error: req.query.error || "" }));
};

exports.createVehicle = async (req, res) => {
  try {
    const { name = "", number = "", type = "Truck", capacity = "", status = "available" } = req.body;
    if (!name.trim() || !number.trim() || !type.trim() || !capacity.trim()) {
      return res.redirect("/admin/vehicles?error=All vehicle fields are required");
    }
    await Vehicle.create({ name: name.trim(), number: number.trim(), type: type.trim(), capacity: Number(capacity) || 0, status: status.trim() || "available" });
    return res.redirect("/admin/vehicles?success=Vehicle added successfully");
  } catch {
    return res.redirect(`/admin/vehicles?error=${encodeURIComponent("Unable to add vehicle")}`);
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { name = "", number = "", type = "Truck", capacity = "", status = "available" } = req.body;
    await Vehicle.findByIdAndUpdate(req.params.id, { name: name.trim(), number: number.trim(), type: type.trim(), capacity: Number(capacity) || 0, status: status.trim() || "available" });
    return res.redirect("/admin/vehicles?success=Vehicle updated successfully");
  } catch {
    return res.redirect(`/admin/vehicles?error=${encodeURIComponent("Unable to update vehicle")}`);
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/vehicles?success=Vehicle deleted successfully");
  } catch {
    return res.redirect(`/admin/vehicles?error=${encodeURIComponent("Unable to delete vehicle")}`);
  }
};

exports.renderRoutes = async (req, res) => {
  const routes = await Route.find().sort({ _id: -1 });
  return res.render("admin/routes", buildViewModel({ pageTitle: "Manage Routes", currentPath: "/admin/routes", routes, success: req.query.success || "", error: req.query.error || "" }));
};

exports.createRoute = async (req, res) => {
  try {
    const { source = "", destination = "", distance = "", duration = "", status = "active" } = req.body;
    if (!source.trim() || !destination.trim() || !distance.trim() || !duration.trim()) {
      return res.redirect("/admin/routes?error=All route fields are required");
    }
    await Route.create({ source: source.trim(), destination: destination.trim(), distance: distance.trim(), duration: duration.trim(), status: status.trim() || "active" });
    return res.redirect("/admin/routes?success=Route added successfully");
  } catch {
    return res.redirect(`/admin/routes?error=${encodeURIComponent("Unable to add route")}`);
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { source = "", destination = "", distance = "", duration = "", status = "active" } = req.body;
    await Route.findByIdAndUpdate(req.params.id, { source: source.trim(), destination: destination.trim(), distance: distance.trim(), duration: duration.trim(), status: status.trim() || "active" });
    return res.redirect("/admin/routes?success=Route updated successfully");
  } catch {
    return res.redirect(`/admin/routes?error=${encodeURIComponent("Unable to update route")}`);
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/routes?success=Route deleted successfully");
  } catch {
    return res.redirect(`/admin/routes?error=${encodeURIComponent("Unable to delete route")}`);
  }
};

exports.renderBookings = async (req, res) => {
  const [bookings, vehicleOptions, driverOptions] = await Promise.all([
    Booking.find().sort({ _id: -1 }).populate("user", "name email").populate("route", "source destination").populate("vehicle", "name number").populate("driver", "name phone"),
    Vehicle.find().sort({ name: 1 }),
    Driver.find().sort({ name: 1 }),
  ]);

  return res.render("admin/bookings", buildViewModel({
    pageTitle: "Manage Bookings",
    currentPath: "/admin/bookings",
    bookings,
    vehicleOptions,
    driverOptions,
    success: req.query.success || "",
    error: req.query.error || "",
  }));
};

exports.updateBooking = async (req, res) => {
  try {
    const { status = "pending", vehicle = "", driver = "" } = req.body;
    const existingBooking = await Booking.findById(req.params.id).populate("user", "name email").populate("route", "source destination").populate("vehicle", "name number").populate("driver", "name phone");

    if (!existingBooking) {
      return res.redirect("/admin/bookings?error=Booking not found");
    }

    const wasConfirmed = existingBooking.status === "confirmed";

    existingBooking.status = status.trim() || "pending";
    existingBooking.vehicle = vehicle || null;
    existingBooking.driver = driver || null;
    await existingBooking.save();

    const populatedBooking = await Booking.findById(existingBooking._id)
      .populate("user", "name email")
      .populate("route", "source destination")
      .populate("vehicle", "name number")
      .populate("driver", "name phone");

    if (!wasConfirmed && populatedBooking.status === "confirmed") {
      try {
        const emailSent = await sendBookingConfirmationEmail(populatedBooking);
        if (emailSent) {
          populatedBooking.confirmationSentAt = new Date();
          await populatedBooking.save();
        }
      } catch (error) {
        console.error("Booking confirmation email failed:", formatMailError(error));
      }
    }

    return res.redirect("/admin/bookings?success=Booking updated successfully");
  } catch {
    return res.redirect(`/admin/bookings?error=${encodeURIComponent("Unable to update booking")}`);
  }
};
