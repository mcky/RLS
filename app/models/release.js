var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, passportLocalMongoose = require('passport-local-mongoose')

var Release = new Schema({
	isHosted: Boolean
	, URL: String
	, title: String
	, datePublished: Date
	, dateCreated: Date
	// , dateEdited: Date
	// , createdBy: String //ObjectID?
	, content: [{
		text: String
	}]
})

module.exports = mongoose.model('Release', Release)
