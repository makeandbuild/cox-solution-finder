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
			slug: locals.filters.partner
		});

		q.exec(function(err, result) {
			result.title = result.title.replace(' Preview', '');
			locals.data.partner = result;
			next(err);
		});

	});

	// Render the view
	if(req.query.mode == 'showroom') {
		view.render('showroom/partner');
	} else {
		view.render('partner');
	}};