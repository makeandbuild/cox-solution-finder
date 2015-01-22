var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'industries';
	locals.filters = {
		industry: req.params.industry
	};
	locals.data = {};

	// Load the current industries
	view.on('init', function(next) {

		var q = keystone.list('Industry').model.findOne({
			state: 'published',
			slug: locals.filters.industry
		});

		q.exec(function(err, result) {
			locals.data.industry = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function(next) {

		var q = keystone.list('Service').model.find().where('state', 'published').populate('services');

		q.exec(function(err, results) {
			locals.data.services = results;
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
	view.render('industry');
};
