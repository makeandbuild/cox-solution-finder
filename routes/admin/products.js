var keystone = require('keystone'),
	Product = keystone.list('Product'),
	Service = keystone.list('Service');;

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'products';
	locals.data = {};

	// Load the current service
	view.on('init', function(next) {
		var sort = '';
		if(req.query.sort) {
			sort = req.query.sort;
		}
		var q = Product.model.find({
			state: 'published'
		})
		.populate('editor')
		.populate('services')
		.sort('order');

		q.exec(function(err, results) {
			locals.data.user = req.user.id;
			if(!locals.data.productsList) {
				locals.data.productsList = results;
			}
			locals.data.model = Product;
			locals.data.defaultColumns = Product.defaultColumns;
			next(err);
		});

	});

	view.on('init', function(next) {
		var q = Service.model.find({
			state: 'published'
		});

		q.exec(function(err, results) {
			locals.data.services = results;
			next();
		});
	});

	// Render the view
	view.render('admin/products');
};
