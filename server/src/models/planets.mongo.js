const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
  name: {
    keplerName: String,
    required: true,
  },
})

module.exports = planetsSchema;