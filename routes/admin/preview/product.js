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
	locals.preview = true;

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
		var slug = locals.filters.product;
		var serviceSlug;
		var previewProduct;
		var q = keystone.list('Product').model.findOne({
			slug : slug
		})
		.populate('services');

		q.exec(function(err, result){
			if(result) {
				serviceSlug = result.get('services')[0]['slug'];
				previewProduct = result;
				previewProduct.title = previewProduct.title.replace(' Preview', '');
				console.log(1);
			}
			console.log(2);
		}).then(function() {
			console.log(3);
			slug = serviceSlug
			q = keystone.list('Service').model.findOne({
				state: 'published',
				slug: slug
			}).populate('industries');

			q.exec(function(err, result) {
				locals.data.service = result;
				console.log(4);
				// console.log(result);
			}).then(function() {
				console.log(6);
				var q = keystone.list('Product').model.find()
						.where('state', 'published')
						.in('services', [locals.data.service.id])
						.sort('order');

				q.exec(function(err, results) {
					console.log(results.length);
					for(i=0; i<results.length; i++) {
						if(results[i]['slug'] == req.query.originalSlug) {
							results[i] = previewProduct;
							console.log(7);
						}
					}
					console.log(8);
					locals.data.products = results;
					next(err);
				});
			});
			console.log(5);
		})


	});

	// Load Industries
	view.on('init', function(next) {

		var q = keystone.list('Industry').model.find()
				.where('state', 'published')
				.populate('services');

		q.exec(function(err, results) {
			locals.data.industries = results;
			next(err);
		});

	});

	// Render the view
	if(req.query.mode == 'showroom') {
		view.render('showroom/service');
	} else {
		view.render('service');
	}
};
