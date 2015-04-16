var keystone = require('keystone'),
	Partner = keystone.list('Partner'),
	Service = keystone.list('Service'),
	util = require('util');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'partners';
	locals.filters = {
		partner: req.params.partner
	};
	locals.data = {};
	locals.data.model = Partner;
	locals.data.relationships = {};

	//
	view.on('init', function(next) {
		var q = Service.model.find({
			state: 'published'
		});

		q.exec(function(err, results) {
			locals.data.relationships.Service = results;
			next(err);
		})
	});

	// Load the current Partner
	view.on('init', function(next) {
		var current;
		var preview;

		var q = Partner.model.findOne({
			state: 'published',
			slug: locals.filters.partner
		})
		.populate('custom_ordered_services')
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
					slug = locals.filters.partner + '-preview';	
				}

				var previewQuery = Partner.model.findOne({
					slug: slug
				}).populate('custom_ordered_services')

				previewQuery.exec(function(err, result) {
					preview = result;
					// console.log(preview.media_buffet)
					if(preview) {
						fields = Partner.schema.methods.updateableFields().split(', ');
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
					}
				});
			} else {
				locals.data.current = current;
				next();
			}
		});
	});

	// Render the view
	view.render('admin/partner');
};
