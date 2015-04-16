var keystone = require('keystone'),
	Product = keystone.list('Product'),
	Service = keystone.list('Service'),
	util = require('util');

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
	locals.data.model = Product;
	locals.data.relationships = {};

	//Populate relationships
	view.on('init', function(next) {
		var q = Service.model.find({
			state: 'published'
		});

		q.exec(function(err, results) {
			locals.data.relationships.Service = results;
			next(err);
		})
	});

	view.on('init', function(next) {
		var q = Industry.model.find({
			state: 'published'
		});

		q.exec(function(err, results) {
			locals.data.relationships.Industry = results;
			next(err);
		})
	});
	
	// Load the current Product
	view.on('init', function(next) {
		var current;
		var preview;

		var q = Product.model.findOne({
			state: 'published',
			slug: locals.filters.product
		})
		.populate('industries')
		.populate('services')
		.populate('editor')
		.populate('updatedBy');

		
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
				    locals.data.current = current;
				}
			}
			
		}).then(function(err) {
			if(locals.savedPreview) {
				if(locals.previewSlug) {
					slug = locals.previewSlug;
				} else {
					slug = locals.filters.product + '-preview';	
				}
				
				var previewQuery = Product.model.findOne({
					slug: slug
				})
				.populate('industries')
				.populate('services')
				.populate('editor')
				.populate('updatedBy');

				previewQuery.exec(function(err, result) {
					preview = result;

					if(preview) {
						fields = Product.schema.methods.updateableFields().split(', ');
						for(x in fields) {
							path = fields[x];
							if(path == 'title') {
								current.set(path, preview.get(path).replace(' Preview', ''));
							} else if(path != 'editor' && path  != 'slug') {
								current.set(path, preview.get(path));
							}
						}

						locals.data.current = current;
						next(err);
					} else {
						next(err);
					}
				});
			} else {
				locals.data.current = current;
				next();
			}
		});
	});

	// Render the view
	view.render('admin/product');
};
