var keystone = require('keystone'),
	Connect = keystone.list('Connect'),

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
		    locals.data.current.save();
		    next(err);
		}
	  })
	  .then(function() {
	  	if(!locked) {
  		  	var userQuery = keystone.list('User').model.findOne({
		  		_id : locals.data.current.updatedBy
	  		});
		  	userQuery.exec(function(err, result) {
		  			locals.data.current.lastEditor = result.name.full;
				    next(err);
		  	});
		} else {
			next();
		}
	});


	});

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'admin-connect' }, function(next) {
		
		var ConnectModel;
		
		var q = keystone.list('Connect').model.findOne({
			slug: 'connect'
		});
		console.log(req.body);
		q.exec(function(err, result) {
			ConnectModel = result;
			updater = ConnectModel.getUpdateHandler(req);

			updater.process(req.body, {
				flashErrors: true,
				fields: 'name, heading, content, connect_background',
				errorMessage: 'There was a problem submitting your enquiry:'
			}, function(err) {
				if(err) {
					req.flash('error', 'There was an issue!');
				} else {
					req.flash('success', 'Your changes have been saved.');
				}
				locals.data.current = ConnectModel;
				next(err);
			});

		});

	});

	view.on('post', { action: 'preview' }, function(next) {

		//CHECK REQUEST TYPE IN REQ (for AJAX)

		var q = keystone.list('Connect').model.findOne({
			slug: 'connect-preview'
		});		

		q.exec(function(err, result) {
			var preview;
			if(result) {
				preview = result; 
			} else {
				preview = new Connect.model({ name : 'Connect Preview'});
			}

			console.log(req.body);
			req.body.name = 'Connect Preview';
			console.log(req.body);
			
			updater = preview.getUpdateHandler(req);

			updater.process(req.body, {
				flashErrors: true,
				fields: 'name, heading, content, connect_background',
				errorMessage: 'There was a problem submitting your enquiry:'
			}, function(err) {
				if(err) {
					req.flash('error', 'There was an issue!');
				} else {
					req.flash('success', 'Preview Ready');
				}

				// res.json('success', 'success');
				next(err);
			});

		});

		// res.redirect('/admin/preview/connect');

	});

	view.render('admin/connect');

};
