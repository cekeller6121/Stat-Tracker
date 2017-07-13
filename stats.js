const mongoose = require('mongoose');

const Stat = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  stat: { type: Number},
  date: { type: Date, default: Date.now }
});
