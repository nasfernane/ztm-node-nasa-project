const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
    // default: 100,
    // min: 100,
    // max: 999,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    // approche A recommandée en NoSQL: stocker directement l'objet imbriqué
    type: String,
    // approche B plus compliquée: stocker une référence à un objet contenu dans une autre collection
    // type: mongoose.ObjectId,
    // ref: 'Planet'
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});


// connecte le schéma avec la collection "Launch"
module.exports = mongoose.model('Launch', launchesSchema)
