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
	locals.data = {
		industry: []
	};

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

	// Render the view
	view.render('industry');
};
