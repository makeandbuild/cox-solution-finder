var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {};

	var isPersonal = true;

	if (isPersonal) {
		locals.data.custom_data = {};

		//Fake Data
		locals.data.custom_data.name = {};
		locals.data.custom_data.name.first = "Mark";
		locals.data.custom_data.name.last = "Cunningham";
		locals.data.custom_data.eventName = "LA Hospitality Convention";

		locals.data.custom_data.favorites = {};
		locals.data.custom_data.favorites.industries = ['hospitality', 'government'];
		locals.data.custom_data.favorites.services = ['internet', 'tv', 'voice'];
	}

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
