const launches = new Map();

const launch = {
  flightNumber: 101,
  mission: "Kepler 17",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-442 b",
  customer: ["NASA", "ZTM"],
  upcoming: false,
  success: true,
}

launches.set(launch.flightNumber, launch);

module.exports = {
  launches,
}