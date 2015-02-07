var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'products';
	locals.filters = {
		product: req.params.product
	};
	locals.data = {};
	locals.data.referer = {};

	if (req.headers['referer']){
		var referer_link = req.headers['referer'].split('/');
		if (referer_link.length == 5){
			locals.data.referer.slug = referer_link[4];
			locals.data.referer.parent = referer_link[3];
			locals.data.referer.link = req.headers['referer'];
			locals.data.referer.category = '';
		} else if (referer_link.length == 6){
			locals.data.referer.slug = referer_link[4];
			locals.data.referer.parent = referer_link[3];
			locals.data.referer.category = referer_link[5];
			locals.data.referer.link = req.headers['referer'];
		} else {
			locals.data.referer = false;
		}
	} else {
		locals.data.referer = false;
	}
	

	// Load the current service
	view.on('init', function(next) {

		var q = keystone.list('Product').model.findOne({
			state: 'published',
			slug: locals.filters.product
		});

		q.exec(function(err, result) {
			locals.data.product = result;
			next(err);
		});

	});


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
	view.render('product');
};
