var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, passportLocalMongoose = require('passport-local-mongoose')

var Account = new Schema({
	nameOrOrg: String
	, isPersonal: Boolean
	, isContributor: Boolean
	, isSubscriber: Boolean
	, isAdmin: Boolean
	, orgEmail: String
	, orgPhone: String
	, dateRegistered: Date
	, address: {
		lineOne: String
		, lineTwo: String
		, city: String
		, postcode: String
		, country: String
	}
})

Account.plugin(passportLocalMongoose,{
	usernameField: 'email'
	, usernameLowerCase: true
})

module.exports = mongoose.model('Account', Account)
