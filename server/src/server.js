const http = require('http');
const app = require('./app');
// import { app } from './app';

require('dotenv').config();

const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');
const { mongoConnect } = require('./services/mongo');


const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT} !`)
  });
}

startServer();



