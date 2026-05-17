const Vehicle = require("../models/Vehicle");

exports.addVehicle = async (req, res) => {
  return res.status(403).json({
    message: "Only the admin dashboard can add vehicles.",
  });
};

exports.getVehicles = async (req, res) => {
  const data = await Vehicle.find();
  res.json(data);
};
