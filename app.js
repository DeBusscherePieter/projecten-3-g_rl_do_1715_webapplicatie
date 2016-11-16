var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var helpers = require('handlebars-helpers')();




mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout:'layout', helpers: require('handlebars-helpers').helpers}));



// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});







///////////////////////////////////////////////////
var mongojs = require('mongojs');
var dbM = mongojs('maaltijdList', ['maaltijdList']);
app.get('/maaltijdList', function(req, res) {
  console.log("I received a GET request")

  dbM.maaltijdList.find(function(err, docs){
    console.log(docs);
    res.json(docs);
  });
});

app.post('/maaltijdList', function(req, res){
  console.log(req.body);
  dbM.maaltijdList.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/maaltijdList/:id', function(req, res){
  var id = req.params.id;
  console.log(id);
  dbM.maaltijdList.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.get('/maaltijdList/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  dbM.maaltijdList.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.put('/maaltijdList/:id', function(req, res){
  var id = req.params.id;
  console.log(req.body.datum);
  dbM.maaltijdList.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {datum_creatie: req.body.datum_creatie, datum: req.body.datum, beschrijving: req.body.beschrijving, id: req.body.id, prijs: req.body.prijs, restaurant_id: req.body.restaurant_id, titel: req.body.titel, datum_update: req.body.datum_update}},
    new: true}, function(err, doc){
      res.json(doc);

  });
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////                                             RESTAURANT
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var db2 = mongojs('restaurantList', ['restaurantList']);

app.get('/restaurantList', function(req, res) {
  console.log("I received a GET request")

  db2.restaurantList.find(function(err, docs){
    console.log(docs);
    res.json(docs);
  });
});

app.post('/restaurantList', function(req, res){
  console.log(req.body);
  db2.restaurantList.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/restaurantList/:id', function(req, res){
  var id = req.params.id;
  console.log(id);
  db2.restaurantList.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.get('/restaurantList/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  db2.restaurantList.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.put('/restaurantList/:id', function(req, res){
  var id = req.params.id;
  console.log(req.body.datum);
  db2.restaurantList.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {adres: req.body.adres, created_at: req.body.created_at, id: req.body.id, lat: req.body.lat, lng: req.body.lng, naam: req.body.naam, openingsuren: req.body.openingsuren}},
    new: true}, function(err, doc){
      res.json(doc);

  });
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////                    ACTIVITEITEN                    /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var db3 = mongojs('activiteitenList', ['activiteitenList']);

app.get('/activiteitenList', function(req, res) {
  console.log("I received a GET request")

  db3.activiteitenList.find(function(err, docs){
    console.log(docs);
    res.json(docs);
  });
});

app.post('/activiteitenList', function(req, res){
  console.log(req.body);
  db3.activiteitenList.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/activiteitenList/:id', function(req, res){
  var id = req.params.id;
  console.log(id);
  db3.activiteitenList.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.get('/activiteitenList/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  db3.activiteitenList.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.put('/activiteitenList/:id', function(req, res){
  var id = req.params.id;
  db3.activiteitenList.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {naam: req.body.naam, info: req.body.info, datum: req.body.datum, tijdstip: req.body.tijdstip, locatie: req.body.locatie, campus: req.body.campus, adres: req.body.adres}},
    new: true}, function(err, doc){
      res.json(doc);

  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////












app.use('/', routes);
app.use('/users', users);



// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
