/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var keystone = require('keystone');
		_ = require('underscore'),
		async = require('async'),
		url = require('url');

var lists = {	'services': 'Service',
				'industries': 'Industry',
				'partners': 'Partner',
				'products': 'Product',
				'connect': 'Connect',
				'homepage': 'Homepage',
				'map': 'Map'
			};


exports.setState = function(req,res,next){
	var locals = res.locals;

	locals.gohtml = req.query.html;

	locals.linkURI = function(uri) {
		if (typeof(uri) == 'string' && locals.gohtml) {
			if (uri === '/') {
				uri = '/index';
			}
			uri = uri + '.html';
		}
		return uri;
	}

	locals.assetURI = function(uri) {
		if (typeof(uri) == 'string' && locals.gohtml && /\/uploads\//.test(uri)) {
			uri = uri.replace(/^.*\/uploads\//, "/s3/");
		}
		return uri;
	}

	locals.assetData = function(obj) {
		if (!locals.gohtml) { return obj; }

		if (obj && obj.url) {
			obj.url = locals.assetURI(obj.url);
			return obj;
		}

		return _.mapObject(obj, function(val, key) {
			if (val && val.url) {
				val.url = locals.assetURI(val.url);
			}
			return val;
		});
	}

	next();
}

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
		{ label: 'Homepage',	key: 'homepage',	href: '/homepage',		type: 'page',	adminOnly: true },
		{ label: 'Industries',	key: 'industries', 	href: '/industries', 	type: 'modal' },
		{ label: 'Services',	key: 'services',	href: '/services', 		type: 'modal' },
		{ label: 'Partners',	key: 'partners',	href: '/partners', 		type: 'modal' },
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

	async.parallel([
		function(callback) {
			var serviceQuery = keystone.list('Service').model.find().where('state', 'published');
			serviceQuery.exec(function(err, results) {
				locals.global_data.services = results;
				callback(err, results);
			});
		},
		function(callback) {
			var industryQuery = keystone.list('Industry').model.find().where('state', 'published');
			industryQuery.exec(function(err, results) {
				locals.global_data.industries = results;
				callback(err, results);
			});
		},
		function(callback) {
			var partnerQuery = keystone.list('Partner').model.find().where('state', 'published');
			partnerQuery.exec(function(err, results) {
				locals.global_data.partners = results;
				callback(err, results);
			});	
		},
		function(callback) {
			var homeQuery = keystone.list('Homepage').model.findOne({
				slug: 'home'
			});
			homeQuery.exec(function(err, results) {
				if (results.hero.video.video.url){
					locals.global_data.default_video = results.hero.video;
					callback(err, results.hero.video);
				} else {
					locals.global_data.default_video = false;
					callback(err, false);
				}
			});
		}		
	], function(err, results) {
		//TO;DO should probably check for an error here, but not sure what we'd do with it...
		next();
	});
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
		res.redirect('/signin');
	} else {
		next();
	}

};


/**
	If user has a personalized email they hit /personalized/:enquiry and we decrypt and forward them to their custom home page.
*/
exports.personalized = function(req, res, next) {
	var uid = req.params.enquiry;
	res.locals.uid = uid;
	if(!req.cookies.UID) {
		res.cookie('UID', uid);
	}

	// res.redirect('/');

	next();
};

exports.unlockUserDocs = function(req, res, next) {

	//Don't do anything on a refresh or a reclick
	if(req.headers.referer) {

		var referer = url.parse(req.headers.referer);
		if(referer.pathname != req.url) {
		
			//Strip /admin/ from referrer url.
			pathname = referer.pathname;
			pathname = pathname.replace('/admin', '');
			if(pathname.charAt(0) == '/') {
				pathname = pathname.substr(1,pathname.length);
			}

			pathparts = pathname.split('/');

			//If no pathparts[1] we're coming from a list page, adming page, or either homepage or connects
			var q;
			if(pathparts[1] != undefined) {
				q = keystone.list(lists[pathparts[0]]).model.findOne({
				    slug: pathparts[1],
				    editor: req.user.id
			  	});

			} else {
				//Being extra cautious that nothing slips through the logic above
				if(pathparts[0] == 'homepage' || pathparts[0] == 'connect') {
					console.log('homepage or connect');
					q = keystone.list(lists[pathparts[0]]).model.findOne({
		    			slug: pathparts[0],
				    	editor: req.user.id
			  		});
				}
			}

			//Make sure the query was created. More cautiousness.
			if(q) {
				q.exec(function(err, result) {
				  	if(result) {
					  	if(result.editor) {
					  		console.log('UNLOCK IT');
						  	result.editor = undefined;
						  	result.save();
					  	}
				  	}
				  	next();
			  	});
			} else {
				next();
			}
		} else {
			next();
		}
	} else {
		next();		
	}

};

exports.timerUnlockUserDocs = function(req, res, next) {

	for(x in lists) {
		q = keystone.list(lists[x]).model.find()
			.where('state', 'published')
			.where('editor').ne(undefined)
			.where('checkoutTime').lt(Date.now() - 30*60*1000);

		q.exec(function(err, results) {
		  	if(results) {
		  		for(var i = 0; i < results.length; i++) {
		  			result = results[i];
		  			result.editor = undefined;
		  			result.checkoutTime = null;
		  			result.save();
		  		}
		  	}
	  	});

	}

	next();

};