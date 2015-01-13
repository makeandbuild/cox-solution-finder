var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'services';
	locals.filters = {
		service: req.params.service
	};
	locals.data = {};

	// Load the current service
	view.on('init', function(next) {

		var q = keystone.list('Service').model.findOne({
			state: 'published',
			slug: locals.filters.service
		});

		q.exec(function(err, result) {
			locals.data.service = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function(next) {

		var q = keystone.list('Product').model.find().where('state', 'published');

		q.exec(function(err, results) {
			locals.data.products = results;
			next(err);
		});

	});


	// Render the view
	view.render('service');
};
