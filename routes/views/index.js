var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {};

	// ---------------
	// Navigation Data
	view.on('init', function(next) {
		var q = keystone.list('Service').model.find().where('state', 'published');
		q.exec(function(err, results) {
			locals.data.navigation_services = results;
			next(err);
		});
	});
	view.on('init', function(next) {
		var q = keystone.list('Industry').model.find().where('state', 'published');
		q.exec(function(err, results) {
			locals.data.navigation_industries = results;
			next(err);
		});
	});
	// ---------------
	
	// Render the view
	view.render('index');
	
};
