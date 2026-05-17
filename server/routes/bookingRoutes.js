const router = require("express").Router();
const auth = require("../middleware/auth");
const { createBooking, getMyBookings } = require("../controllers/bookingController");

router.get("/", auth, getMyBookings);
router.post("/", auth, createBooking);

module.exports = router;
