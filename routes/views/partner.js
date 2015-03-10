var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'partners';
	locals.filters = {
		partner: req.params.partner
	};
	locals.data = {
		partner: []
	};

	// Load the current industries
	view.on('init', function(next) {

		var q = keystone.list('Partner').model.findOne({
			state: 'published',
			slug: locals.filters.partner
		});

		q.exec(function(err, result) {
			locals.data.partner = result;
			next(err);
		});

	});

	// Render the view
	view.render('partner');
};
