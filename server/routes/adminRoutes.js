const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { redirectIfAdminAuth, requireAdminAuth } = require("../middleware/adminAuth");

router.get("/", requireAdminAuth, (req, res) => res.redirect("/admin/dashboard"));
router.get("/login", redirectIfAdminAuth, adminController.renderLogin);
router.post("/login", redirectIfAdminAuth, adminController.login);
router.post("/logout", requireAdminAuth, adminController.logout);
router.get("/dashboard", requireAdminAuth, adminController.renderDashboard);
router.get("/drivers", requireAdminAuth, adminController.renderDrivers);
router.post("/drivers", requireAdminAuth, adminController.createDriver);
router.post("/drivers/:id/update", requireAdminAuth, adminController.updateDriver);
router.post("/drivers/:id/delete", requireAdminAuth, adminController.deleteDriver);
router.get("/vehicles", requireAdminAuth, adminController.renderVehicles);
router.post("/vehicles", requireAdminAuth, adminController.createVehicle);
router.post("/vehicles/:id/update", requireAdminAuth, adminController.updateVehicle);
router.post("/vehicles/:id/delete", requireAdminAuth, adminController.deleteVehicle);
router.get("/routes", requireAdminAuth, adminController.renderRoutes);
router.post("/routes", requireAdminAuth, adminController.createRoute);
router.post("/routes/:id/update", requireAdminAuth, adminController.updateRoute);
router.post("/routes/:id/delete", requireAdminAuth, adminController.deleteRoute);
router.get("/bookings", requireAdminAuth, adminController.renderBookings);
router.post("/bookings/:id/update", requireAdminAuth, adminController.updateBooking);

module.exports = router;
