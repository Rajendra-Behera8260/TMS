const router = require("express").Router();
const auth = require("../middleware/auth");
const { getStats, getMe } = require("../controllers/dashboardController");

router.get("/", auth, getStats);
router.get("/me", auth, getMe);

module.exports = router;
