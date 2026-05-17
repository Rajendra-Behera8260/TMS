const router = require("express").Router();
const auth = require("../middleware/auth");
const { addVehicle, getVehicles } = require("../controllers/vehicleController");

router.post("/", auth, addVehicle);
router.get("/", auth, getVehicles);

module.exports = router;
