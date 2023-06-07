const planets = require('../../models/planets.model');

function getAllPlanets(res, res) {
  console.log('planets req')
  return res.status(200).json(planets);
}

module.exports = {
  getAllPlanets
}