const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 0;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

// let latestFlightNumber = 100;

const launch = {
  flightNumber: 101, // correspond à flight_number  dans api spacex
  mission: "Kepler 17", // name
  rocket: "Explorer IS1", // rocket.name
  launchDate: new Date("December 27, 2030"), // date_local
  target: "Kepler-442 b", // pas de correspodnance
  customers: ["NASA", "ZTM"], // payload.customers pour chaque payload
  upcoming: true, // upcoming
  success: true, // success
}

saveLaunch(launch);


async function loadLaunchData() {
  // const instance = axios.create({
  //   baseURL: SPACEX_BASE_API + '/launches',
  //   timeout: 1000,
  //   header: {'X-Custom-Header': 'foobar'}
  // });

  // const launches = await instance.get();
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
            height: 1
          }
        }, {
          path: 'payloads',
          select:  {
            customers: 1,
          }
        }
      ]
    } 
  })

  const launchData = response.data.docs;
  console.log('launchData[0]')
  console.log(launchData[0])

}

async function getLatestFlightNumber() {
  const latestLaunch = await launches
    .findOne({})
    .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launches
    .find({}, { '_id': 0, '__v': 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found")
  }

  // updateOne ne fait pas que mettre à jour le document dans la base, il mutate également l'objet passé en argument (ici launch)
  // findOneAndUpdate ne renvoie que les propriétés définies dans l'objet à upsert
  // await launches.updateOne({
  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, 
  launch, {
    upsert: true,
  });
}


async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  });

  await saveLaunch(newLaunch);
}


async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber: launchId,
  }, 
  {
    upcoming: false,
    success: false
  });

  return aborted.modifiedCount === 1;
}


async function existsLaunchById(launchId) {
  return await launches.findOne({
    flightNumber: launchId,
  });
}

module.exports = {
  getAllLaunches,
  loadLaunchData,
  scheduleNewLaunch,
  abortLaunchById,
  existsLaunchById,
}