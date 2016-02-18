/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.setState);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	admin: importRoutes('./admin')
};

// Setup Route Bindings
exports = module.exports = function(app) {

	app.get('/_status_/heartbeat', function (req, res) {
		res.type("text").send("OK");
	});

	// Views
	app.all('/', routes.views.index);
	app.all('/connect', routes.views.connect);

	app.all('/personalized/:enquiry', middleware.personalized, function(req, res) { res.redirect('/'); });

	app.all('/personalized', function(req, res) { res.redirect('/'); });

	app.all('/settings', routes.views.settings);

	app.get('/industries/:industry', routes.views.industry);

	app.get('/services/:service', routes.views.service);

	app.get('/services/:service/:industry', routes.views.service_by_industry);

	app.get('/products/:product', routes.views.product);

	app.get('/sitemap.json', keystone.middleware.api, routes.views.json.sitemap);

	app.post('/showroom-sync', routes.views.json.showroom_sync);

	app.get('/partners/:partner', routes.views.partner);

	// Session
	app.all('/signin', routes.views.session.signin);
	app.all('/signout', routes.views.session.signout);
	app.all('/forgot-password', routes.views.session['forgot-password']);
	app.all('/reset-password/:key', routes.views.session['reset-password']);


	// Admin
	app.all('/admin*', middleware.requireUser);
	app.all('/admin*', middleware.unlockUserDocs);
	app.all('/admin*', middleware.timerUnlockUserDocs);
	app.all('/admin*', middleware.s3cleaner);


	app.all('/admin', routes.admin.index);
	app.all('/admin/me', routes.admin.me);

	app.all('/admin/connect', middleware.saveData, routes.admin.connect);
	app.all('/admin/homepage', middleware.saveData, routes.admin.homepage);

	app.all('/admin/services', routes.admin.services);
	app.all('/admin/services/:service', middleware.saveData, routes.admin.service);


	app.all('/admin/industries', routes.admin.industries);
	app.all('/admin/industries/:industry', middleware.saveData, routes.admin.industry);

	app.all('/admin/partners', routes.admin.partners);
	app.all('/admin/partners/:partner', middleware.saveData, routes.admin.partner);

	app.all('/admin/products', middleware.saveProductListOrder, routes.admin.products);
	app.all('/admin/products/:product', middleware.saveData, routes.admin.product);

	app.all('/admin/maps', routes.admin.maps);
	app.all('/admin/maps/:map', middleware.saveData, routes.admin.map);

	// app.post('/admin/preview', keystone.middleware.api, routes.admin.preview.index);
	app.all('/admin/preview/connect', routes.admin.preview.connect);
	app.all('/admin/preview/homepage', routes.admin.preview.homepage);
	app.all('/admin/preview/services/:service', routes.admin.preview.service);
	app.all('/admin/preview/industries/:industry', routes.admin.preview.industry);
	app.all('/admin/preview/partners/:partner', routes.admin.preview.partner);
	app.all('/admin/preview/products/:product', routes.admin.preview.product);


	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
