const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 0;

// let latestFlightNumber = 100;

const launch = {
  flightNumber: 101,
  mission: "Kepler 17",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
}

saveLaunch(launch);

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne({})
    .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDatabase
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
  // await launchesDatabase.updateOne({
  await launchesDatabase.findOneAndUpdate({
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
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId,
  }, 
  {
    upcoming: false,
    success: false
  });

  return aborted.acknowledged && aborted.modifiedCount === 1;
}


async function existsLaunchById(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  existsLaunchById,
}