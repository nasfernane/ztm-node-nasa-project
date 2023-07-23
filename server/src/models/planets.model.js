const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const isHabitable = (planet) => {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 // insolation flux
    && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6; // planetory radius
};


function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    // fs.createReadStream(__dirname + '../../../data/kepler_data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true
    }))
    .on('data', async (planet) => {
      if (isHabitable(planet)) {
        await savePlanet(planet);
      }
    })
    .on('error', (err) => {
      console.log('error:', err);
      reject(err);
    })
    .on('end', async () => {
      const countPlanetsFound = (await getAllPlanets()).length;
      console.log(`${countPlanetsFound} habitable planets found !`)
      resolve();
    })
  })
}


async function getAllPlanets() {
  // return habitablePlanets;
  return await planets.find({})
  // exemples filtre
  // return planets.Find({
  //   keplerName: 'Kepler-62 f'
  // }, {
  //   'keplerName': 1,
  // });
  // return planets.Find({
  //   keplerName: 'Kepler-62 f'
  // }, '-keplerName anotherField');
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name
    }, {
      keplerName: planet.kepler_name
    }, {
      upsert: true,
    });
  } catch (err) {
    console.error(`Could not save planet : ${err}`);
  }
}


module.exports = {
  loadPlanetsData,
  getAllPlanets,
}
