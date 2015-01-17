var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'services';
	locals.filters = {
		service: req.params.service,
		industry: req.params.industry
	};
	locals.data = {};

	// Load the current service
	view.on('init', function(next) {

		//Old queries

		// var q = keystone.list('Service').model.findOne({
		// 	state: 'published',
		// 	slug: locals.filters.service
		// });

		// q.exec(function(err, result) {
		// 	locals.data.service = result;
		// 	next(err);
		// });

		var k = keystone.list('Service').model.findOne({
			state: 'published',
			slug: locals.filters.service
		}).where('industry', locals.filters.industry.id).populate('industries');
		k.exec(function(err, result) {
		    locals.data.service = result;
		    locals.data.industry = locals.filters.industry;
		    next(err);
		});

	});

	// Load products
	view.on('init', function(next) {

		var q = keystone.list('Product').model.find().where('state', 'published').populate('services');

		q.exec(function(err, results) {
			locals.data.products = results;
			next(err);
		});

	});
	// Load products
	view.on('init', function(next) {

		var q = keystone.list('Industry').model.find().where('state', 'published').populate('services');

		q.exec(function(err, results) {
			locals.data.industries = results;
			next(err);
		});

	});



	// ---------------
	// Navigation Data
	view.on('init', function(next) {
		var q = keystone.list('Service').model.find().where('state', 'published');
		q.exec(function(err, results) {
			locals.data.navigation_services = results;
			next(err);
		});
	});
	view.on('init', function(next) {
		var q = keystone.list('Industry').model.find().where('state', 'published');
		q.exec(function(err, results) {
			locals.data.navigation_industries = results;
			next(err);
		});
	});
	// ---------------

	// Render the view
	view.render('service');
};
