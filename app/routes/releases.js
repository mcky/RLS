var express = require('express')
	, router = express.Router()
	, Release = require('../models/release')

releases = {
	list: function(req, res) {
		Release.find( function ( err, releases, count ){
			res.render('releases/all', {
				releases: releases
			})
		})
	}
	, get: function(req, res) {
		Release.findById(req.params.id, function ( err, release, count ){
			res.render('releases/single', {
				release: release
			})
		})
	}
	, post: function(req, res) {
		var url
			, formDataKeys = Object.keys(req.body)
			, newArr = []

		for (var i = 0; i < formDataKeys.length; i++) {
			var found = formDataKeys[i].match(/guideField-\d/g)
			if (found) {
				fieldText = req.body[formDataKeys[i]]
				newArr.push({text: fieldText})
			}
		}

		if (!req.body.url) {
			url = req.user.organisation
			url = url.replace(/\s/g, '')
		} else {
			url = req.body.url
		}
		new Release({
			isHosted : true
			, URL: url
			, title: req.body.title
			, datePublished: req.body.date
			, dateCreated: Date.now()
			, dateEdited: Date.now()
			, content: newArr
		}).save( function( err, release, count ){
			res.redirect( '/releases/'+release._id )
		})
	}
}

submit = function(req, res) {
	res.render('releases/new', {
		title: 'Submit'
	})
}

router.get('/releases', releases.list)
router.post('/releases', releases.post)
router.get('/releases/:id', releases.get)

router.get('/submit', submit)
router.post('/submit', releases.post)

module.exports = router
