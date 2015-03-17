var users = require('./users')
	, releases = require('./releases')
	, temp = require('./temp')

function ensureAuthenticated(req, res, next) {
	// Adding a route to the array skips authentication
	// Warning: skips authentication on all sub routes
	var publicRoutes = ['/', '/login', '/register', '/archive']
		, baseUrl = '/' + req.url.split("/")[1].split("?")[0]

	if (publicRoutes.indexOf(baseUrl) != -1) return next()
	if (req.isAuthenticated()) return next()

	var next = req.url.split("?")[0]
	res.redirect('/login?next='+next)
}

module.exports = function(app){

	app.all('*', ensureAuthenticated)
	app.use('/', users)
	app.use('/', releases)
	app.use('/', temp)

}
