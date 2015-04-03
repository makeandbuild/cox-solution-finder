var keystone = require('keystone'),
	Connect = keystone.list('Connect');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		preview = false,
		locals = res.locals;
	
	// Set locals
	locals.section = 'connect';
	locals.data = {};
	locals.data.model = Connect;
	
	// console.log(locals.data.model);
	


	view.on('init', function(next) {

	  var q = keystone.list('Connect').model.findOne({
	    slug: 'connect'
	  });
	  
	  q.exec(function(err, result) {
	  	var locked = false;

	  	if(result.editor && result.editor != req.user.id) {
	  		locked = true;
	  		req.flash('info', 'LOCKED!');
	  		res.redirect('/admin');
	  	} else {
		    locals.data.current = result;
		    locals.data.current.editor = req.user;
		    locals.data.current.checkoutTime = Date.now();
		    locals.data.current.save();
		}
		if(err) {
			throw err;
		}
	  })
	  .then(function() {
  		  	var userQuery = keystone.list('User').model.findOne({
		  		_id : locals.data.current.updatedBy
	  		});
		  	userQuery.exec(function(err, result) {
		  		console.log(result.name.full);
	  			locals.data.current.lastEditor = result.name.full;
	  			next(err);
			});
		});

	});

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'admin-connect' }, function(next) {
		
		var current;
		
		var q = keystone.list('Connect').model.findOne({
			slug: 'connect'
		});
		console.log(req.body);
		q.exec(function(err, result) {
			current = result;
			updater = current.getUpdateHandler(req);

			updater.process(req.body, {
				flashErrors: true,
				fields: Connect.updateableFields,
				errorMessage: 'There was a problem submitting your enquiry:'
			}, function(err) {
				if(err) {
					req.flash('error', 'There was an issue!');
				} else {
					req.flash('success', 'Your changes have been saved.');
				}
				locals.data.current = current;
				next(err);
			});

		});

	});

	view.render('admin/connect');

};
