var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'connect';
	locals.company_population = Enquiry.fields.company_population.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.data = {};
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'connect' }, function(next) {
		
		var newEnquiry = new Enquiry.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, zipcode, company_population, is_customer, showname',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
		
	});

	view.on('init', function(next) {

	  var q = keystone.list('Connect').model.findOne({
	    slug: 'connect'
	  })

	  q.exec(function(err, result) {
	    locals.data.connect = result;
	    next(err);
	  });

	});

	view.on('init', function(next) {

	  var productQuery = keystone.list('Product').model.find().where('state', 'published').sort('order');
	  productQuery.exec(function(err, results) {
	  	locals.global_data.products = results;
	  	next(err);
	  });

	});

	// view.on('init', function(next) {

	//   var partnerQuery = keystone.list('Partner').model.find().where('state', 'published');
	//   partnerQuery.exec(function(err, results) {
	//   	locals.global_data.partners = results;
	//   	next(err);
	//   });

	// });
	



	
	view.render('connect');
	
};
