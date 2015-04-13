var keystone = require('keystone'),
	Service = keystone.list('Service'),
	util = require('util');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'services';
	locals.filters = {
		service: req.params.service,
		industry: req.params.industry
	};
	locals.data = {};
	locals.data.model = Service;
	locals.data.relationships = {};

	// Load the current service
	view.on('init', function(next) {
		var current;
		var preview;

		var q = Service.model.findOne({
			state: 'published',
			slug: locals.filters.service
		})
		.populate('editor')
		.populate('updatedBy')
		.populate('industries');

		q.exec(function(err, result) {
			if(result) {
			  	var locked = false;
			  	if(result.editor && result.editor.id != req.user.id) {
			  		locked = true;
			  		req.flash('info', 'LOCKED!');
			  		res.redirect('/admin');
			  	} else {
				    current = result;
				    current.editor = req.user;
				    current.checkoutTime = Date.now();
				    current.save();
				}
			}
		}).then(function(err) {
			if(locals.savedPreview) {
				if(locals.previewSlug) {
					slug = locals.previewSlug;
				} else {
					slug = locals.filters.service + '-preview';	
				}
				
				var previewQuery = Service.model.findOne({
					slug: slug
				})
				.populate('industries');

				previewQuery.exec(function(err, result) {
					preview = result;
					if(preview) {
						fields = Service.schema.methods.updateableFields().split(', ');
						for(x in fields) {
							path = fields[x];
							if(path == 'title') {
								current[path] = preview[path].replace(' Preview', '');
							} else if(path != 'editor' || path != 'industries' || path  != 'slug') {
								current[path] = preview[path];
							}
						}
						// locals.data.products = current.getProducts();
						locals.data.current = current;
						next(err);
					}
				});
			} else {
				locals.data.current = current;
				next();
			}
		});
	});

	// // Load Products
	// view.on('init', function(next) {

	// 	var q = keystone.list('Product').model.find()
	// 			.where('state', 'published')
	// 			.where('services', locals.data.current.id)
	// 			.populate('services')
	// 			.sort('order');

	// 	q.exec(function(err, results) {
	// 		locals.data.products = results;
	// 		next(err);
	// 	});

	// });
	// // Load Industries
	view.on('init', function(next) {

		var q = keystone.list('Industry').model.find()
				.where('state', 'published')
				.populate('services');

		q.exec(function(err, results) {
			locals.data.relationships.Industry = results;
			next(err);
		});

	});

	// Render the view
	view.render('admin/service');
};
