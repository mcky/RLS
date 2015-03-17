var express = require('express')
	, router = express.Router()
	, passport = require('passport')
	, Account = require('../models/account')
	, Release = require('../models/release')

router.get('/', function(req, res) {
	res.render('home')
})

router.get('/dev/clear/accs', function(req, res) {
	Account.find({}).remove().exec()
	res.redirect('/')
})

router.get('/dev/clear/releases', function(req, res) {
	Release.find({}).remove().exec()
	res.redirect('/')
})

router.get('/dev/list/accounts', function(req, res) {
	Account
		.find({})
		.select('-hash -salt')
		.exec(function(err, accounts, count) {
			res.json(accounts)
		})
})

router.get('/dev/new/account', function(req, res) {
	Account.register(new Account({
			email: req.query.email || 'con@gmail.com'
			, nameOrOrg: req.query.name || 'name or org'
			, isPersonal: req.query.isPersonal || false
			, isContributor: req.query.isContributor || false
			, isSubscriber: req.query.isSubscriber || false
			, isAdmin: req.query.isAdmin || false
			, orgEmail: req.query.orgEmail || 'org@email.com'
			, orgPhone: req.query.orgPhone || '07401234567'
			, dateRegistered: Date.now()
		}), 'password', function(err) {
		if (err) {
			console.log('error while user register!', err)
			return next(err)
		}

		console.log('user registered!')

		passport.authenticate('local')(req, res, function () {
			res.redirect('/')
		})
	})
})

router.get('/dev/new/releases', function(req, res) {
	var dateStr = new Date().toISOString().slice(11, -5)
	new Release({
		isHosted : true
		, title: 'Dummy post at '+ dateStr
		, datePublished: Date.now()
		, dateCreated: Date.now()
		, dateEdited: Date.now()
		, content: [{text:'abc'}]
	}).save( function( err, release, count ){
		res.redirect('/')
	})
})

module.exports = router
