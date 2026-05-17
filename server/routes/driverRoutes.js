const router = require("express").Router();
const auth = require("../middleware/auth");
const {getDrivers} =require("../controllers/driverController");

router.get("/", auth, getDrivers);

module.exports = router;
