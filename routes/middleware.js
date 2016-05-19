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
		url = require('url'),
		Connect = keystone.list('Connect'),
		Homepage = keystone.list('Homepage'),
		Industry = keystone.list('Industry'),
		Map = keystone.list('Map'),
		Partner = keystone.list('Partner'),
		Product = keystone.list('Product'),
		Service = keystone.list('Service'),
		security = require('../components/security.js'),
		util = require('util'),
		moment = require('moment'),
		s3cleanup = require('../components/s3cleanup');

//index model by name
var Models = {	'Connect': Connect,
				'Homepage': Homepage,
				'Industry': Industry,
				'Map': Map,
				'Partner': Partner,
				'Product': Product,
				'Service': Service
			};

//index model by slug
var slugs = {	'connect': Connect,
				'homepage': Homepage,
				'industries': Industry,
				'partners': Partner,
				'products': Product,
				'maps': Map,
				'services': Service
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

	locals.md5hash = security.md5hash;

	locals.isObjInArray = function(needle, haystack) {

		if(util.isArray(haystack) && typeof needle == "object") {
			for(i=0; i < haystack.length; i++) {
				if(haystack[i]['id'] === needle.id) {
					return true;
				}
			}
			return false;
		} else {
			return false;
		}
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
		{ label: 'Home',		key: 'home',		href: '/', 			 	type: 'page', 	admin: false },
		{ label: 'Homepage',	key: 'homepage',	href: '/homepage',		type: 'page',	adminOnly: true },
		{ label: 'Industries',	key: 'industries', 	href: '/industries', 	type: 'modal' },
		{ label: 'Services',	key: 'services',	href: '/services', 		type: 'modal' },
		{ label: 'Partners',	key: 'partners',	href: '/partners', 		type: 'modal' },
		{ label: 'Connect',		key: 'connect',		href: '/connect', 		type: 'page' },
		{ label: 'Products',	key: 'products',	href: '/products',		type: 'page',	adminOnly: true },
		{ label: 'Maps',	key: 'maps',	href: '/maps',		type: 'page',	adminOnly: true },
		{ label: 'Settings',	key: 'settings',	href: '/settings', 		type: 'settings',	admin: false },

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
			var serviceQuery = keystone.list('Service').model.find().lean().where('state', 'published').populate('industries').sort("sortOrder");
			serviceQuery.exec(function(err, results) {
				for (i = 0; i < results.length; i++) { 
					var industryList = [];
					for (i2 = 0; i2 < results[i]['industries'].length; i2++) {
						industryList.push(results[i]['industries'][i2]['slug']);
					}
					results[i].industry_list = industryList.slice(0,4);
				}
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

			//If no pathparts[1] we're coming from a list page, admin page, or either homepage or connects
			var q;
			if(pathparts[1] != undefined) {
				Model = slugs[pathparts[0]];
				q = Model.model.findOne({
				    slug: pathparts[1],
				    editor: req.user.id
			  	});

			} else {
				//Being extra cautious that nothing slips through the logic above
				if(pathparts[0] == 'homepage' || pathparts[0] == 'connect') {

					slug = pathparts[0];
					if(slug == 'homepage') {
						slug = 'home';
					}
					Model = slugs[pathparts[0]];
					q = Model.model.findOne({
		    			slug: slug,
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

	for(x in Models) {
		var Model = Models[x];

		q = Model.model.find()
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

exports.saveProductListOrder = function(req, res, next) {
	if(req.body.action == 'reorder') {
		serviceTitle = req.body.service;

		var q = Product.model.find()
				.in('services', [req.body.service_id])
		var success = true;

		q.exec(function(err, results) {
			if(results) {
				for(i=0; i<results.length; i++) {
					product = results[i];
					order = req.body.newOrder.indexOf(product.id);
					updater = product.getUpdateHandler({order: order})
					updater.process({order: order}, {
						flashErrors: false,
						fields: 'order',
						errorMessage: 'There was a problem with saving the new order.'
					}, function(err) {
						if(err) {
							req.flash('error', err);
							success = false;
						}
					});
				}
			}
		}).then(function() {
			if(success) {
				req.flash('success', "Product List Order for <a target='_blank' href=/services/" + req.body.slug + ">" + req.body.service + "</a> Updated");
			}
			next();
		});

	} else {
		next();
	}
}

exports.saveData = function(req, res, next) {

	if(req.body.action == 'preview') {
		var newTitle = false;
		var Model = Models[req.body.key];
		slug = req.body.slug + '-preview';
		res.locals.savedPreivew = false;
		res.locals.newTitle = false;
		res.locals.previewPath = '';
		res.locals.previewSlug = '';

		var autokeyPath = Model.options.autokey.from[0]['path'];
		req.body[autokeyPath] = req.body[autokeyPath] + ' Preview';

		var q = Model.model.findOne({
			slug: slug
		});

		q.exec(function(err, result) {
			var preview;

			if(result) {
				preview = result;
			} else {
				settings = {};
				settings[autokeyPath] = req.body[autokeyPath];
				preview = new Model.model(settings);
				newTitle = true;
			}

			if(!newTitle && req.body[autokeyPath] != result[autokeyPath] && result) {
				newTitle = true;
			}

			updater = preview.getUpdateHandler(req);

			if(preview) {
				for(key in req.body) {

					if(/_s3obj$/.test(key)) {
						s3obj = JSON.parse(req.body[key]);
						key = key.replace('_s3obj', '');

						if(!req.body[key + '_newfile'] || preview.get(key).url != s3obj.url) {
							if(security.md5hash(JSON.stringify(s3obj)) == req.body[key + '_s3obj_hash']) {
								preview.set(key, s3obj);
							} else {
								res.status(418).end('I am a tea pot.');
								return next();
							}
						}
					}
				}
				preview.save();
			}

			updater.process(req.body, {
				flashErros: false,
				fields: Model.schema.methods.updateableFields(),
				errorMessage: 'There was a problem with generating the preview'
			}, function(err) {
				if(err) {
					res.locals.savedPreview = false;
					req.flash('error', err);
				} else {
					res.locals.previewMode = req.body.previewMode;
					res.locals.savedPreview = true;
				}
				if(newTitle) {
					pathname = req.url;
					pathname = pathname.replace('/admin/', '/admin/preview/');
					pathname = pathname.substr(0, pathname.lastIndexOf('/'));
					pathname = pathname + '/' + preview.slug;
					res.locals.previewPath = pathname;
					res.locals.previewSlug = preview.slug;

					next(err);
				} else {
					pathname = req.url;
					pathname = pathname.replace('/admin/', '/admin/preview/');
					pathname = pathname.substr(0, pathname.lastIndexOf('/'));
					res.locals.previewPath = pathname + '/' + preview.slug;

					next(err);
				}

			});
		});
	} else if(req.body.action == 'publish') {
		var Model = Models[req.body.key];


		var q = Model.model.findOne({
			slug: req.body.slug
		});

		var newTitle = false;
		var autokeyPath = Model.options.autokey.from[0]['path'];

		q.exec(function(err, result) {
			current = result;

			if(!newTitle && req.body[autokeyPath] != result[autokeyPath] && result) {
				newTitle = true;
			}

			updater = current.getUpdateHandler(req);
			if(current) {

				for(key in req.body) {

					if(/_s3obj$/.test(key)) {

						s3obj = JSON.parse(req.body[key]);
						key = key.replace('_s3obj', '');

						if(!req.body[key + '_newfile'] || current.get(key).url != s3obj.url) {
							if(security.md5hash(JSON.stringify(s3obj)) == req.body[key + '_s3obj_hash']) {
								current.set(key, s3obj);
							} else {
								res.status(418).end('I am a tea pot.');
								return next();
							}
						}
					}
				}
				current.save();
			}

			req.body.lastEditAt = moment().format();

			updater.process(req.body, {
				flashErrors: true,
				fields: Model.schema.methods.updateableFields(),
				errorMessage: 'There was a problem publishing your changes.'
			}, function(err) {

				if(err) {
					req.flash('error', err);
				} else {
					req.flash('success', 'Your changes have been published.');
				}

				if(newTitle) {
					pathname = req.url;
					pathname = pathname.substr(0, pathname.lastIndexOf('/'));
					pathname = pathname + '/' + current.slug;
					res.redirect(pathname);
					// next(err);
				} else {
					next(err);
				}

			});

		});
	} else {
		next();
	}
}

exports.s3cleaner = function(req, res, next) {

	if(Math.random() < 0.1) {
		console.log('CLEAN IT');
		s3cleanup(keystone.mongoose);
	}
	next();
}
