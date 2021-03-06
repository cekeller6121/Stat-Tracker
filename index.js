const express = require('express');
const mustacheExpress = require('mustache-express')
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const Stat = require('./stats.js');
const User = require('./users.js')
mongoose.connect('mongodb://localhost:27017/statsdb');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(session({ secret: 'chit chat', cookie: { maxAge: 300000 }}));

app.get('/', function(req, res) {
  req.session.authenticated = false;
  res.redirect('/login');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirmPassword;
  if (password != confirm) {
    res.redirect('/signup');
  } else {
    let user = new User({
      username: username,
      password: password
    });
    user.save().then(function() {
      console.log("User stat added to database");
    }).catch(function() {
      console.log("Access denied, bud");
    });
  };
    req.session.authenticated = true;
    res.redirect('/api/activities');
  });

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username, password: password}).then(function(User) {
    if (User.username === username && User.password === password) {
    req.session.authenticated = true;
    res.redirect('api/activities');
    console.log(username + " signed in");
  } else {
    res.redirect('login');
    console.log("Login didn't work, bud");
  };
  }).catch(function(handleError) {
    res.redirect('login');
    console.log("Error occured. User not signed in.");
  });
});

app.get('/api/activities', function(req, res) {
  if (req.session.authenticated === true) {
  Stat.find().then(function(stats) {
    res.render('stats', {allStats:stats});
  }).catch(function(handleError) {
    console.log("Error finding stats, friend")
  });
} else {
  res.redirect('/login');
};
});

app.get('/api/activities/:activity', function(req, res) {
  Stat.find({name: req.params.activity}).then(function(record) {
    res.render('activity', {activity:record});
  }).catch(function(handleError) {
    res.redirect('/');
    console.log("Record not found, bud");
  });
});

app.post('/api/activities/:activity', function(req, res) {
  Stat.updateOne({name: req.params.activity}, { $push: {stat: req.body.updateBox}}).then(function () {
    res.redirect('/api/activities');
  });
  });

app.post('/api/activities', function(req, res) {
  let stat = new Stat({
    name: req.body.inputStatName,
    type: req.body.inputStatType,
    stat: req.body.inputStatNumber
  });
  stat.save().then(function() {
    console.log("User stat added to database");
  }).catch(function() {
    console.log("Access denied, bud");
  });
  res.redirect('/api/activities');
});


// *** Add first record to statsdb ***
// let stat = new Stat({
//   name: "Languages Spoken",
//   type: "Language",
//   stat: 1
// });
//
// stat.save().then(function() {
//   console.log("stat added to database")
// }).catch(function() {
//   console.log("Access denied, bud");
// });

// *** Add first record to statsdb user collection ***
// let user = new User({
//   username: "chadwick",
//   password: "pass"
// });
//
// user.save().then(function() {
//   console.log("user added to database")
// }).catch(function() {
//   console.log("Access denied, bud");
// });

app.listen(3000, function(req, res) {
  console.log("Port 3000 wants your stats");
});
