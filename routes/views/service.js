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

		var q = keystone.list('Service').model.findOne({
			state: 'published',
			slug: locals.filters.service
		}).populate('industries');

		q.exec(function(err, result) {
			locals.data.service = result;
			next(err);
		});

	});

	// Load Products
	view.on('init', function(next) {

		var q = keystone.list('Product').model.find().where('state', 'published').where('services', locals.data.service.id).populate('services');

		q.exec(function(err, results) {
			locals.data.products = results;
			next(err);
		});

	});
	// Load Industries
	view.on('init', function(next) {

		var q = keystone.list('Industry').model.find().where('state', 'published').populate('services');

		q.exec(function(err, results) {
			locals.data.industries = results;
			next(err);
		});

	});

	// Render the view
	view.render('service');
};
