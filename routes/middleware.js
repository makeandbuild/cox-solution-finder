/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');
var keystone = require('keystone');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	var locals = res.locals;

	locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/', 			 	type: 'page' },
		{ label: 'Industries',	key: 'industries', 	href: '/industries', 	type: 'modal' },
		{ label: 'Services',	key: 'services',	href: '/services', 		type: 'modal' },
		{ label: 'Connect',		key: 'connect',		href: '/connect', 		type: 'page' },
		{ label: 'Settings',	key: 'settings',	href: '/settings', 		type: 'settings' },

	];

	locals.user = req.user;
	locals.params = req.params
	locals.global_data = {
		services: [],
		industries: [],
		default_video: []
	};

	var serviceQuery = keystone.list('Service').model.find().where('state', 'published');
	serviceQuery.exec(function(err, results) {
		locals.global_data.services = results;
	});
	var industryQuery = keystone.list('Industry').model.find().where('state', 'published');
	industryQuery.exec(function(err, results) {
		locals.global_data.industries = results;
	});
	var homeQuery = keystone.list('Homepage').model.findOne({
		slug: 'home'
	});
	homeQuery.exec(function(err, results) {
		if (results.hero.video.video.url){
			locals.global_data.default_video = results.hero.video;
		} else {
			locals.global_data.default_video = false;
		}
	})

	next();

};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};

	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;

	next();

};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {

	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}

};
