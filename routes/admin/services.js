var keystone = require('keystone'),
	Service = keystone.list('Service');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'services';
	locals.data = {};

	// Load the current service
	view.on('init', function(next) {
		var sort = '';
		if(req.query.sort) {
			sort = req.query.sort;
		}
		var q = Service.model.find({
			state: 'published'
		})
		.populate('industries')
		.populate('editor')
		.sort(sort);

		q.exec(function(err, results) {
			locals.data.user = req.user.id;
			locals.data.serviceList = results;
			locals.data.model = Service;
			locals.data.defaultColumns = Service.defaultColumns;
			next(err);
		});

	});

	// // Load Products
	// view.on('init', function(next) {

	// 	var q = keystone.list('Product').model.find().where('state', 'published').where('services', locals.data.service.id).populate('services').sort('order');

	// 	q.exec(function(err, results) {
	// 		locals.data.products = results;
	// 		next(err);
	// 	});

	// });
	// // Load Industries
	// view.on('init', function(next) {

	// 	var q = keystone.list('Industry').model.find().where('state', 'published').populate('services');

	// 	q.exec(function(err, results) {
	// 		locals.data.industries = results;
	// 		next(err);
	// 	});

	// });

	// Render the view
	view.render('admin/services');
};
