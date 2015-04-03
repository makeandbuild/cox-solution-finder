var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry');

var showroom = true;


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
	locals.title = 'Cox Solution Finder -- PREVIEW MODE';
	// console.log(locals.data.model);
	
	console.log(req.body);

	view.on('init', function(next) {

	  var q = keystone.list('Connect').model.findOne({
	    slug: 'connect-preview'
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

	view.on('init', function(next) {
		showroom = false;
		next();
	});


	if(showroom) {
		view.render('showroom/connect');
	} else {
		view.render('connect');
	}
	
};


