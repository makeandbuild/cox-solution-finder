var keystone = require('keystone'),
	Homepage = keystone.list('Homepage'),
	Product = keystone.list('Product');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'home';
	locals.data = {};
	locals.data.model = Homepage;
	locals.data.relationships = {};

	// Populate relationship fields
	view.on('init', function(next) {
		var q = Product.model.find({
			state: 'published'
		});

		q.exec(function(err, results) {
			locals.data.relationships.Product = results;
			next(err);
		})
	});

	// Load current
	view.on('init', function(next) {
		var current;
		var preview;

		var q = Homepage.model.findOne({
			slug: 'home'
		})
		.populate('editor')
		.populate('updatedBy');

		q.exec(function(err, result) {
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
		}).then(function(current){
			if(locals.savedPreview) {
				var previewQuery = Homepage.model.findOne({
					slug: 'connect-preview'
				})
				.populate('editor');

				previewQuery.exec(function(err, result) {
					preview = result;
					if(preview) {
						fields = Homepage.schema.methods.updateableFields().split(', ');
						for(x in fields) {
							path = fields[x];
							if(path != 'name') {
								current[path] = preview[path];
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

	view.render('admin/homepage');

};
