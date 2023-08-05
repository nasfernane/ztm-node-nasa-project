const { 
  getAllLaunches,
  abortLaunchById,
  existsLaunchById,
  scheduleNewLaunch
 } = require('../../models/launches.model');

 const { 
  getPagination 
} = require('./../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit} = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission || 
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property"
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid date"
    });
  }

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const { id } = req.params;

  const existsLaunch = await existsLaunchById(Number(id));

  if (!existsLaunch) {
    return res.status(400).json({
      error: "Wrong flight number"
    })
  }

  const aborted = await abortLaunchById(Number(id));

  if (!aborted) {
    return res.status(400).json({
      error: "launch not aborted"
    })
  } else {
    return res.status(200).json({
      ok: true
    });
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}