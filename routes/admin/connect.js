var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'connect';
	locals.data = {};
	locals.data.model = keystone.list('Connect');
	
	// console.log(locals.data.model);
	
	// On POST requests, add the Enquiry item to the database
	// view.on('post', { action: 'connect' }, function(next) {
		
	// 	var newEnquiry = new Enquiry.model(),
	// 		updater = newEnquiry.getUpdateHandler(req);
		
	// 	updater.process(req.body, {
	// 		flashErrors: true,
	// 		fields: 'name, email, zipcode, company_population, is_customer, showname',
	// 		errorMessage: 'There was a problem submitting your enquiry:'
	// 	}, function(err) {
	// 		if (err) {
	// 			locals.validationErrors = err.errors;
	// 		} else {
	// 			locals.enquirySubmitted = true;
	// 		}
	// 		next();
	// 	});
		
	// });

	view.on('init', function(next) {

	  var q = keystone.list('Connect').model.findOne({
	    slug: 'connect'
	  });

	  q.exec(function(err, result) {
	    locals.data.current = result;
	    next(err);
	  });

	});
	
	view.render('admin/connect');
	
};
