const Driver = require("../models/Driver");
exports.getDrivers = async (req, res) => {
    res.json(await Driver.find());
};