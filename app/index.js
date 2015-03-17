var express = require('express')
	, mongoose = require('mongoose')
	, passport = require('passport')
	, methodOverride = require('method-override')
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser')
	, session = require('cookie-session')
	, async = require('async')
	, hbs = require('hbs')
	, app = express()
	, port = process.env.PORT || 4000
	, LocalStrategy = require('passport-local').Strategy
	, Account = require('./models/account')

app.set('views', __dirname + '/views')
app.set('view options', { layout:'layout.html' })
app.set('view engine', 'html')
app.engine('html', hbs.__express)
app.use(express.static(__dirname + '/public'))
hbs.registerPartials(__dirname + '/views/partials')
hbs.localsAsTemplateData(app)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(session({ keys: ['secretkey1', 'secretkey2', '...']}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(Account.authenticate()))
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

if (process.env.NODE_ENV === 'testing') {
	mongoose.connect(process.env.MONGOLAB_URI)
} else {
	mongoose.connect('mongodb://localhost/rls')
}

// Locals
app.use(function(req, res, next){
	res.locals.session = req.session
	res.locals.user = req.user
	res.locals.query = req.query
	res.locals.env = process.env.NODE_ENV
	next()
})

// Handlebars Helpers
require('./hbs-helpers')(app)

// Routes
require('./routes')(app)


app.listen(port, function(){
	console.log('Server running')
})
