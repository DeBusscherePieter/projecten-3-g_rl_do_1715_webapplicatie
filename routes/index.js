var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

//Get Restaurants
router.get('/restaurants', ensureAuthenticated, function(req, res) {
		if(req.user.werknemer === false){
			res.render('404', {layout: false});
		} else {
		  res.render('restaurants');
		}
});

//Get Maaltijden
router.get('/maaltijden', ensureAuthenticated, function(req, res) {
	if(req.user.werknemer === false){
		res.render('404', {layout: false});
	} else {
    res.render('maaltijden');
	}
});

//Get activiteiten
router.get('/activiteiten', ensureAuthenticated, function(req, res) {
    res.render('activiteiten');
});

router.get('/users/edit', ensureAuthenticated, function(req,res){
	res.render('edit');
});

router.get('/users/edit/mail', ensureAuthenticated, function(req, res){
	res.redirect('/users/edit');
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;
