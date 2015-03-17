var express = require('express')
	, router = express.Router()
	, passport = require('passport')
	, Account = require('../models/account')

login = {
	get: function(req, res) {
		if (req.isAuthenticated()) {
			req.logout()
			res.redirect('/login')
		} else {
			res.render('login')
		}
	}
	, post: function(req, res) {
		var next = req.body.next || '/'
		res.redirect(next)
	}
}

logout = function(req, res) {
	req.logout()
	res.redirect('/login')
}

register = {
	get: function(req, res) {
		res.render('register')
	}
	, post: function(req, res, next) {
		Account.register(new Account({ email: req.body.username, organisation: req.body.userOrg }), req.body.password, function(err) {
			if (err) {
				console.log('error while user register!', err)
				return next(err)
			}

			console.log('user registered!')

			passport.authenticate('local')(req, res, function () {
				var next = req.body.next || '/'
				res.redirect(next)
			})
		})
	}
}

account = {
	get: function(req, res) {
		res.render('account/index')
	}
	, post: function(req, res) {
		Account.findByIdAndUpdate(req.user._id, {
			// Logs you out if you change email?
			email: req.body.userEmail
			, organisation: req.body.userOrg
			, address: {
				lineOne: req.body.addrLineOne
				, lineTwo: req.body.addrLineTwo
				, city: req.body.addrCity
				, postcode: req.body.addrPost
				, country: req.body.addrCountry
			}
		},function(){
			res.redirect('/account')
		})
	}
}

router.get('/login', login.get)
router.post('/login', passport.authenticate('local'), login.post)

router.get('/logout', logout)
router.post('/logout', logout)

router.get('/register', register.get)
router.post('/register', register.post)

router.get('/account', account.get)
router.post('/account', account.post)

module.exports = router
