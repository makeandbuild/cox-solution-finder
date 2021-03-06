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
			slug: locals.filters.industry
		});

		q.exec(function(err, result) {
			result.title = result.title.replace(' Preview', '');
			locals.data.industry = result;
			next(err);
		});

	});

	// Render the view
	if(req.query.mode == 'showroom') {
		view.render('showroom/industry');
	} else {
		view.render('industry');
	}
};
