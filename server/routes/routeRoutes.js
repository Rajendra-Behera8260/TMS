const router = require("express").Router();
const auth = require("../middleware/auth");
const { getRoutes } = require("../controllers/routeController");

router.get("/", auth, getRoutes);

module.exports = router;
