// const launches = require('./launches.mongo');
const launches = new Map();

let latestFlightNumber = 100;

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


launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(latestFlightNumber, Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  }));
}

function abortLaunchById(launchId) {
  let aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

function existsLaunchById(launchId) {
  return launches.has(launchId);
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  existsLaunchById,
}