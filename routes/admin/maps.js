var keystone = require('keystone'),
	Map = keystone.list('Map');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'maps';
	locals.data = {};

	// Load the current service
	view.on('init', function(next) {
		var sort = '';
		if(req.query.sort) {
			sort = req.query.sort;
		}
		var q = Map.model.find({
			state: 'published'
		})
		.populate('editor')
		.sort(sort);

		q.exec(function(err, results) {
			locals.data.user = req.user.id;
			locals.data.mapsList = results;
			locals.data.model = Map;
			locals.data.defaultColumns = Map.defaultColumns;
			next(err);
		});

	});

	// Render the view
	view.render('admin/maps');
};
