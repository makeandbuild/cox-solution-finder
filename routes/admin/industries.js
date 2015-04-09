var keystone = require('keystone'),
	Industry = keystone.list('Industry');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'industries';
	locals.filters = {
		service: req.params.service,
		industry: req.params.industry
	};
	locals.data = {};

	// Load the current service
	view.on('init', function(next) {
		var sort = '';
		if(req.query.sort) {
			sort = req.query.sort;
		}
		var q = Industry.model.find({
			state: 'published'
		})
		.populate('editor')
		.sort(sort);

		q.exec(function(err, results) {
			locals.data.user = req.user.id;
			locals.data.industryList = results;
			locals.data.model = Industry;
			locals.data.defaultColumns = Industry.defaultColumns;
			next(err);
		});

	});

	// Render the view
	view.render('admin/industries');
};
