var keystone = require('keystone'),
	Map = keystone.list('Map'),
	Product = keystone.list('Product'),
	util = require('util');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'maps';
	locals.filters = {
		map: req.params.map
	};
	locals.data = {};
	locals.data.model = Map;
	locals.data.relationships = {};

	//
	view.on('init', function(next) {
		var q = Product.model.find({
			state: 'published'
		});

		q.exec(function(err, results) {
			locals.data.relationships.Product = results;
			next(err);
		})
	});

	// Load the current Map
	view.on('init', function(next) {
		var current;
		var preview;

		var q = Map.model.findOne({
			state: 'published',
			slug: locals.filters.map
		})
		.populate('products')
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
					slug = locals.filters.industry + '-preview';	
				}
				
				var previewQuery = Partner.model.findOne({
					slug: slug
				})

				previewQuery.exec(function(err, result) {
					preview = result;
					// console.log(preview.media_buffet)
					if(preview) {
						fields = Partner.schema.methods.updateableFields().split(', ');
						for(x in fields) {
							path = fields[x];
							if(path == 'title') {
								current.set(path, preview.get(path).replace(' Preview', ''));
							} else if(path != 'editor' && path  != 'slug' && path != 'lastEditAt') {
								current.set(path, preview.get(path));
							}
						}

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

	// Render the view
	view.render('admin/map');
};
