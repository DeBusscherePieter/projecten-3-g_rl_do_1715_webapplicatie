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
var bcrypt = require('bcryptjs');


var url = process.env.MONGOLAB_URI;
mongoose.connect(url);
//mongoose.connect('mongodb://localhost/loginapp');
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






var collections = ["users", "verification", "maaltijdList", "restaurantList", "activiteitenList", "efpl", "efpluser"];
var mongojs = require('mongojs');
var dbjs = mongojs(url,collections);
//var dbjs = mongojs.connect(url, collections);
///////////////////////////////////////////////////
//var dbM = mongojs('maaltijdList', ['maaltijdList']);
app.get('/maaltijdList', function(req, res) {
  console.log("I received a GET request")

  dbjs.maaltijdList.find(function(err, docs){
    console.log(docs);
    res.json(docs);
  });
});

app.post('/maaltijdList', function(req, res){
  console.log(req.body);
  dbjs.maaltijdList.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/maaltijdList/:id', function(req, res){
  var id = req.params.id;
  console.log(id);
  dbjs.maaltijdList.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.get('/maaltijdList/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  dbjs.maaltijdList.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.put('/maaltijdList/:id', function(req, res){
  var id = req.params.id;
  console.log(req.body.datum);
  dbjs.maaltijdList.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {datum: req.body.datum, beschrijving: req.body.beschrijving, id: req.body.id, prijs: req.body.prijs, restaurant_id: req.body.restaurant_id, titel: req.body.titel,
                   'allergenen.gluten': req.body.allergenen.gluten,
                   'allergenen.schaaldieren': req.body.allergenen.schaaldieren,
                   'allergenen.eieren': req.body.allergenen.eieren,
                   'allergenen.vis': req.body.allergenen.vis,
                   'allergenen.aardnoten': req.body.allergenen.aardnoten,
                   'allergenen.soja': req.body.allergenen.soja,
                   'allergenen.melk': req.body.allergenen.melk,
                   'allergenen.noten': req.body.allergenen.noten,
                   'allergenen.selderij': req.body.allergenen.selderij,
                   'allergenen.mosterd': req.body.allergenen.mosterd,
                   'allergenen.sesamzaad': req.body.allergenen.sesamzaad,
                   'allergenen.zwavel': req.body.allergenen.zwavel,
                   'allergenen.lupine': req.body.allergenen.lupine,
                   'allergenen.weekdieren': req.body.allergenen.weekdieren}},
    new: true}, function(err, doc){
      res.json(doc);

  });
});


///////////////////////////////////////////////
///////////////  REKENINGEN ///////////////////
///////////////////////////////////////////////
app.get('/efpl/:before/:after', function(req,res){
    var email = req.params.before + '@' +  req.params.after;
    console.log(email);
    dbjs.efpl.find({mail: email}, {}, function(err,docs){
       res.json(docs);
    });
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////                                             RESTAURANT
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//var db2 = mongojs('restaurantList', ['restaurantList']);

app.get('/restaurantList', function(req, res) {
  console.log("I received a GET request")

  dbjs.restaurantList.find(function(err, docs){
    console.log(docs);
    res.json(docs);
  });
});

app.post('/restaurantList', function(req, res){
  console.log(req.body);
  dbjs.restaurantList.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/restaurantList/:id', function(req, res){
  var id = req.params.id;
  console.log(id);
  dbjs.restaurantList.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.get('/restaurantList/:id/maaltijdList', function(req,res){
   var id = req.params.id;
    dbjs.maaltijdList.find({'restaurant_id':id}, function(err,doc){
        res.json(doc);
    })
});

app.get('/restaurantList/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  dbjs.restaurantList.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.put('/restaurantList/:id', function(req, res){
  var id = req.params.id;
  console.log(req.body.datum);
  dbjs.restaurantList.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {adres: req.body.adres, id: req.body.id, lat: req.body.lat, lng: req.body.lng, naam: req.body.naam, openingsuren: req.body.openingsuren}},
    new: true}, function(err, doc){
      res.json(doc);

  });
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////                    ACTIVITEITEN                    /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//var db3 = mongojs('activiteitenList', ['activiteitenList']);

app.get('/activiteitenList', function(req, res) {
  console.log("I received a GET request")

  dbjs.activiteitenList.find(function(err, docs){
    console.log(docs);
    res.json(docs);
  });
});

app.get('/activiteitenList/goedgekeurd', function(req, res){
    dbjs.activiteitenList.find({goedkeuring: 'OK'}, {}, function(err,docs){
        var newDocs = []
        for(var index = 0; index < docs.length; ++index){
          var dateArray = docs[index].datum.split("/");
          var date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0])
          if(date.setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)){
            newDocs.push(docs[index])
          }
        }
        res.json(newDocs);
    });
});

app.post('/activiteitenList', function(req, res){
  console.log(req.body);
  dbjs.activiteitenList.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/activiteitenList/:id', function(req, res){
  var id = req.params.id;
  console.log(id);
  dbjs.activiteitenList.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.get('/activiteitenList/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  dbjs.activiteitenList.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.put('/activiteitenList/:id', function(req, res){
  var id = req.params.id;
  dbjs.activiteitenList.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {naam: req.body.naam, info: req.body.info, datum: req.body.datum, tijdstip: req.body.tijdstip, locatie: req.body.locatie, campus: req.body.campus, adres: req.body.adres, goedkeuring: req.body.goedkeuring, email: req.body.email}},
    new: true}, function(err, doc){
      res.json(doc);

  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// VERGETEN ///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
var generatePassword = require('password-generator');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://hogent.mijnresto@gmail.com:MijnRest0@smtp.gmail.com');
//var db4 = mongojs('loginapp', ['users']);
app.post('/users/vergeten', function(req, res){
  var gebruiker = req.body.username;
  var mail = req.body.mail;
  console.log(gebruiker);


  dbjs.users.findOne({username: req.body.username, email: req.body.mail},{username: req.body.username, email: req.body.mail}, function(err, doc){
    if(doc){
        if(doc.email === req.body.mail && doc.username === req.body.username){
          console.log("Gebruiker bestaat!");
          var nieuwWachtwoord = generatePassword(10, false);
          //nieuwWachtwoord in bcrypt
          var cryptWachtwoord = bcrypt.hashSync(nieuwWachtwoord);
          console.log(cryptWachtwoord);
          dbjs.users.update({username: req.body.username, email: req.body.mail}, {$set: {password: cryptWachtwoord}});

          var mailOptions = {
            from: '"Mijn Resto Team" <hogent.mijnresto@gmail.com>', // sender address
            to: mail, // list of receivers
            subject: 'Aanvraag nieuw wachtwoord!', // Subject line
            //text: 'Nieuwe wachtwoord is' + nieuwWachtwoord // plaintext body
            html: '<h1>Aanvraag nieuw wachtwoord</h1> <p> Beste ' + gebruiker + ', <br><br> U hebt een aanvraag gedaan voor een nieuw wachtwoord. Het nieuwe wachtwoord is <b>' + nieuwWachtwoord + '</b> </p> <p>  <br> <br> Met vriendelijke groeten <br> Mijn Resto Team</p>' // html body
          };

          transporter.sendMail(mailOptions, function(error, info){
            if(error){
              return console.log(error);
            }
              console.log('Message sent: ' + info.response);
            });
            res.render('vergeten',{success_msg: "Wij hebben u een e-mail gestuurd met het nieuwe wachtwoord!"});
          }

      } else {
        res.render('vergeten',{error_msg: "Incorrecte gegevens!"});
    }
  });
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// EDIT WACHTWOORD /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




app.post('/users/edit/password', function(req, res){

  if(!req.body.currentPassword || !req.body.newPassword || !req.body.newPasswordRepeat){
    res.render('edit',{error_msg_pass: "Gelieve alle velden in te vullen."});
  } else {

    dbjs.users.findOne({username: req.body.username},{username: 1, password: 1}, function(err,doc){

      bcrypt.compare(req.body.currentPassword, doc.password, function(err, isMatch) {
        	if(err) throw err;
          if(isMatch){
            if(req.body.newPassword === req.body.newPasswordRepeat){
              var regex = new RegExp("(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{4,15})$");
              if(regex.test(req.body.newPassword)){

                if(req.body.newPassword === req.body.currentPassword){
                  res.render('edit',{error_msg_pass: "Uw nieuw wachtwoord mag niet gelijk zijn aan uw huidig wachtwoord."});
                }

                dbjs.users.update({username: req.body.username}, {$set: {password: bcrypt.hashSync(req.body.newPassword)}});
                res.render('edit',{success_msg_pass: "Uw wachtwoord is succesvol gewijzigd!"});
              } else {
                res.render('edit',{error_msg_pass: "Uw nieuw wachtwoord voldoet niet aan het juiste formaat."});
              }
            } else {
              res.render('edit',{error_msg_pass: "De twee nieuwe opgegeven wachtwoorden zijn niet gelijk."});
            }
          } else {
            res.render('edit',{error_msg_pass: "Uw huidig wachtwoord is incorrect."});
          }
    	});

    });
  }
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Wijzig email ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var passgen = require('pass-gen');
//var db5 = mongojs('loginapp', ['verification']);
app.post('/users/edit/mail', function(req, res){
  if(!req.body.newMail || !req.body.newMailRepeat){
    res.render('edit',{error_msg_mail: "Gelieve alle velden in te vullen."});
  } else {
    var huidig = req.body.currentMail;
    var newMail = req.body.newMail;
    var newMailRepeat = req.body.newMailRepeat;
    var mailregex = new RegExp(".+@.+");
    if(mailregex.test(newMail)){
        if(newMail === newMailRepeat){
          if(huidig !== newMail){


            //userid
            dbjs.users.findOne({username: req.body.gebruiker}, {_id: 1}, function(err, doc){
              //create token
              var cryptToken = passgen(['ascii', 'numbers'], 10);
              //var cryptToken = bcrypt.hashSync(token);
              //mail
              dbjs.verification.insert({nieuwe_email: newMail, userid: doc._id, token: cryptToken});
              var mailOptions = {
                from: '"Mijn Resto Team" <hogent.mijnresto@gmail.com>', // sender address
                to: newMail, // list of receivers
                subject: 'Aanvraag nieuw e-mailadres!', // Subject line
                html: '<h1>Aanvraag nieuw e-mailadres</h1> <p> Beste '
                + req.body.gebruiker +
                ', <br><br> U hebt een aanvraag gedaan voor een nieuw e-mailadres. U kunt dit e-mailadres instellen als uw huidig e-mailadres via deze link: </br> </br> <a href="http://hogent.herokuapp.com/users/edit/changemail/'
                + newMail
                + '/'
                + doc._id
                + '/'
                + cryptToken
                + '" target="_blank">http://hogent.herokuapp.com/users/edit/changemail/' + newMail + '/' + doc._id + '/' + cryptToken + '</a> </p> <p>Indien u deze aanvraag niet hebt gedaan en u denkt dat uw account aangetast is, wijzigt u best uw wachtwoord.</p> <p> <br> <br> Met vriendelijke groeten <br> Mijn Resto Team</p>' // html body
              };

              transporter.sendMail(mailOptions, function(error, info){
                if(error){
                  console.log("error transporter.sendmail");
                  return console.log(error);
                }
                  console.log('Message sent: ' + info.response);

                });
                res.render('edit',{success_msg_mail: "We hebben u een bevestigingsmail verstuurd."});
            });


          } else {
            res.render('edit',{error_msg_mail: "Het nieuw e-mailadres moet verschillen van uw huidig e-mailadres."});
          }
        } else {
          res.render('edit',{error_msg_mail: "De twee opgegeven e-mailadressen moeten gelijk zijn aan elkaar."});
        }
    } else {
      res.render('edit',{error_msg_mail: "Het e-mailadres moet geldig zijn."});
    }
  }
});


app.get('/users/edit/changemail/:nieuwemail/:userid/:usertoken', function(req, res) {
    dbjs.verification.findOne({userid: mongojs.ObjectId(req.params.userid)}, {token: 1}, function(err,doc){
      if(doc){
        console.log(doc);
        dbjs.users.update({_id: mongojs.ObjectId(req.params.userid)}, {$set: {email: req.params.nieuwemail}});
        dbjs.verification.remove({token: req.params.usertoken}, function(err,doc){
          res.render('mailok');
        });
        res.render('mailok');
      } else {
        res.render('404', {layout: false});
      }
    });
});





///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
////////////////activiteiten email ////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
app.post('/activiteiten', function(req,res){

  if(req.body.iswerknemer === 'false'){
    var mailOptions = {
      from: '"Mijn Resto Team" <hogent.mijnresto@gmail.com>', // sender address
      to: 'pieter.debusschere.v7144@student.hogent.be', // list of receivers
      subject: 'Nieuwe activiteit toegevoegd!', // Subject line
      html: '<h1>Aanvraag nieuwe activiteit</h1> <p> Beste </p> </br>' + req.body.gebruiker + ' heeft een activiteit toegevoegd. U kunt deze aanvraag aanvaarden of wijzigen via de website. </br> </br> Met vriendelijke groeten </br> Mijn Resto Team'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log("error transporter.sendmail");
        return console.log(error);
      }
        console.log('Message sent: ' + info.response);
        res.render('activiteiten', {success_msg_activiteit: "Er is een mail verstuurd met de aanvraag tot goedkeuring van uw activiteit."});
      });
  }

});





///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
////////////// Goedkeuring activiteiten ///////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
app.post('/activiteiten/accept', function(req, res){
  dbjs.activiteitenList.update({_id: mongojs.ObjectId(req.body._id)}, {$set: {goedkeuring: 'OK'}});
  var mailOptions = {
    from: '"Mijn Resto Team" <hogent.mijnresto@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: 'Uw activiteit is aanvaard!', // Subject line
    html: '<h1>Aanvraag nieuwe activiteit</h1> <p> Beste </p> </br> Activiteit "' + req.body.naam + '" is aanvaard. De activiteit is nu zichtbaar voor iedere gebruiker van de mobiele applicatie. Wij wensen u veel succes met het organiseren van uw activiteit! </br> </br> <p>Met vriendelijke groeten </br> Mijn Resto Team</p>'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log("error transporter.sendmail");
      return console.log(error);
    }
      console.log('Message sent: ' + info.response);
      res.redirect('/activiteiten');
    });

});


app.post('/activiteiten/deny', function(req, res){
  dbjs.activiteitenList.update({_id: mongojs.ObjectId(req.body._id)}, {$set: {goedkeuring: 'NOK'}});
  var mailOptions = {
    from: '"Mijn Resto Team" <hogent.mijnresto@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: 'Uw activiteit is geweigerd...', // Subject line
    html: '<h1>Aanvraag nieuwe activiteit</h1> <p> Beste </p> </br> Activiteit "' + req.body.naam + '" is helaas geweigerd. Indien u verdere vragen heeft kunt u ons altijd contacteren. </br> </br> Met vriendelijke groeten </br> Mijn Resto Team'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log("error transporter.sendmail");
      return console.log(error);
    }
      console.log('Message sent: ' + info.response);
      res.redirect('/activiteiten');
    });
});




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// USER KAART ////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/user/:id', function(req, res){
  var id = req.params.id;
  dbjs.efpluser.findOne({'id' : req.params.id},function (err, doc) {
    if (!doc) {
        // we visited all docs in the collection
        res.json("[]");
    } else {
        if(doc.blocked){
            res.json("Kaart is geblokkeerd!");
        } else {
            res.json(doc.mail);
        }
    }
  });
});

app.get('/block/:before/:after', function(req,res){
    var m = req.params.before + '@' + req.params.after;
    dbjs.efpluser.findAndModify({
    query: { mail: m },
        fields: {_id: 0},
    update: { $set: { blocked: true } },
    new: false
    }, function (err, doc, lastErrorObject) {
    res.json('Kaart geblokkeerd!');
});

});








app.use('/', routes);
app.use('/users', users);

app.get('*', function(req, res){
  res.render('404', {layout: false});
});

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
