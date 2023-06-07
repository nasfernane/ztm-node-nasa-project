const { planets } = require('../../models/planets.model');

function getAllPlanets(res, res) {
  return res.status(200).json(planets);
}

module.exports = {
  getAllPlanets
}