const { launches } = require('../../models/launches.model');

function getAllLaunches(req, res) {
  if (launches.size > 0) {
    return res.status(200).json(Array.from(launches.values()));
  } else {
    return res.status(404, "No launches found");
  }
}

module.exports = {
  getAllLaunches,
}