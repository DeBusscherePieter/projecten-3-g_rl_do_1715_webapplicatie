var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

//Get Restaurants
router.get('/restaurants', ensureAuthenticated, function(req, res) {
    res.render('restaurants', {layout: false});
});

//Get Maaltijden
router.get('/maaltijden', ensureAuthenticated, function(req, res) {
    res.render('maaltijden', {layout: false});
});

//Get activiteiten
router.get('/activiteiten', ensureAuthenticated, function(req, res) {
    res.render('activiteiten', {layout: false});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;
