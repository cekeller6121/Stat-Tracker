const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  stat: { type: Array},
  date: { type: Date, default: Date.now }
});

const Stat = mongoose.model('Stat', statSchema, 'stat');

module.exports= Stat;
