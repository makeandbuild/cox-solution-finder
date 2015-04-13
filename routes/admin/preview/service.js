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
	locals.preview = true;

	// Load the current service
	view.on('init', function(next) {
		var slug = locals.filters.service;
		var q = keystone.list('Service').model.findOne({
			state: 'draft',
			slug: slug
		}).populate('industries');

		q.exec(function(err, result) {
			result.title = result.title.replace(' Preview', '');
			locals.data.service = result;
			// console.log(result);
			next(err);
		});

	});

	// Load Products
	view.on('init', function(next) {

		var q = keystone.list('Service').model.findOne({
			slug: req.query.originalSlug
		});
		var original;
		q.exec(function(err, result) {
			original = result;
		}).then(function(err) {
			var q = keystone.list('Product').model.find()
					.where('state', 'published')
					.where('services', original.id)
					.populate('services')
					.sort('order');

			q.exec(function(err, results) {
				locals.data.products = results;
				next(err);
			});
		});



	});
	// Load Industries
	view.on('init', function(next) {

		var q = keystone.list('Industry').model.find()
				.where('state', 'published')
				.populate('services');

		q.exec(function(err, results) {
			locals.data.industries = results;
			next(err);
		});

	});

	// Render the view
	if(req.query.mode == 'showroom') {
		view.render('showroom/service');
	} else {
		view.render('service');
	}
};
