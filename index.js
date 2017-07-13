const express = require('express');
const mustacheExpress = require('mustache-express')
const app = express();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const Stat = require('./stats.js');
mongoose.connect('mongodb://localhost:27017/statsdb');

app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.get('/api/activities', function(req, res) {
  Stat.find().then(function(gimmestats) {
    console.log(gimmestats);
  }).catch(function(handleError) {
    console.log("Error finding stats, friend")
  });
  res.render('stats', {allStats:Stats});
});

app.listen(3000, function(req, res) {
  console.log("Port 3000 wants your stats");
});
