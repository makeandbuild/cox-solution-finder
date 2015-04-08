var keystone = require('keystone'),
	Connect = keystone.list('Connect')

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'connect';
	locals.data = {};
	locals.data.model = Connect;

	view.on('init', function(next) {
		var current;
		var preview;

		var q = Connect.model.findOne({
			slug: 'connect'
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
				var previewQuery = Connect.model.findOne({
					slug: 'connect-preview'
				})
				.populate('editor');

				previewQuery.exec(function(err, result) {
					preview = result;
					if(preview) {
						fields = Connect.schema.methods.updateableFields().split(', ');
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

	view.render('admin/connect');

};
