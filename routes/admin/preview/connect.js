var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	// var safe = true;
	

	// if(req.query) {
	// 	for(x in req.query) {
	// 		if(/^[\w-]+$/.test(req.query[x])) {
	// 			safe = false;
	// 		}
	// 	}
	// }


	// Set locals
	locals.section = 'connect';
	locals.company_population = Enquiry.fields.company_population.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.data = {};
	locals.title = 'Cox Solution Finder -- PREVIEW MODE';
	locals.preview = true;
	

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

	if(req.query.mode == 'showroom') {
		view.render('showroom/connect');
	} else {
		view.render('connect');
	}
	
};


