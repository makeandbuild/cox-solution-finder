var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'settings';
	locals.filters = {
		settings: req.params.settings
	};
	locals.data = {
		setting: []
	};

	// Load the current setting
	view.on('init', function(next) {

		var q = keystone.list('Setting').model.findOne({
			state: 'published',
			slug: locals.filters.settings
		});

		q.exec(function(err, result) {
			locals.data.settings = result;
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
	view.render('settings');
};
