const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
})


// connecte le schéma à la collection Planet
module.exports = mongoose.model("Planet", planetsSchema);
