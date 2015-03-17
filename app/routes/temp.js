var express = require('express')
	, router = express.Router()
	, Account = require('../models/account')
	, Release = require('../models/release')

router.get('/', function(req, res) {
	res.redirect('/login')
})

router.get('/dev/clear/accs', function(req, res) {
	Account.find({}).remove().exec()
	res.redirect('/')
})

router.get('/dev/clear/releases', function(req, res) {
	Release.find({}).remove().exec()
	res.redirect('/')
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
