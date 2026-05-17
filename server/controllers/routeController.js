const Route = require("../models/Route");

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: "Unable to load routes" });
  }
};
