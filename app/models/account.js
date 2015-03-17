var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, passportLocalMongoose = require('passport-local-mongoose')

var Account = new Schema({
	organisation: String
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
