var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;
		locals.data = {};
		locals.user = req.user;

	view.on('init', function(next) {

		var q = keystone.list('Industry').model.find()
				.where('state', 'published')
				.sort('lastEditAt')
				.limit('3')

		q.exec(function(err, results) {
			locals.data.industries = results;
			next(err);
		});
	});

	view.on('init', function(next) {
		var q = keystone.list('Product').model.find()
				.where('state', 'published')
				.sort('lastEditAt')
				.limit('3')

		q.exec(function(err, results) {
			locals.data.products = results;
			next();
		});
	});

	view.on('init', function(next) {
		var q = keystone.list('Service').model.find()
				.where('state', 'published')
				.sort('lastEditAt')
				.limit('3')

		q.exec(function(err, results) {
			locals.data.services = results;
			next();
		});
	});

	view.on('init', function(next) {
		var q = keystone.list('Map').model.find()
				.where('state', 'published')
				.sort('lastEditAt')
				.limit('3')

		q.exec(function(err, results) {
			locals.data.maps = results;
			next();
		});
	});	

	view.render('admin/index');

};
