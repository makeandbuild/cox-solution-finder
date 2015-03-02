var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.company_population = Enquiry.fields.company_population.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.data = {};

	var isPersonal = true;

	if (isPersonal) {
		locals.data.custom_data = {};

		//Fake Data
		locals.data.custom_data.name = {};
		locals.data.custom_data.name.first = "Mark";
		locals.data.custom_data.name.last = "Cunningham";
		locals.data.custom_data.eventName = "LA Hospitality Convention";

		locals.data.custom_data.favorites = {};
		locals.data.custom_data.favorites.industries = ['hospitality', 'government'];
		locals.data.custom_data.favorites.services = ['internet', 'tv', 'voice'];
		locals.data.custom_data.favorites.products = ['optical-internet', 'telecoms'];
	}

	view.on('init', function(next) {

	  var q = keystone.list('Homepage').model.findOne({
	    slug: 'home'
	  }).populate('act.act_three.map_one.products')
	  .populate('act.act_three.map_two.products')
	  .populate('act.act_three.map_three.products')
	  .populate('act.act_three.map_four.products')
	  .populate('act.act_three.map_five.products')
	  .populate('act.act_three.map_six.products');

	  q.exec(function(err, result) {
	    locals.data.home = result;
	    next(err);
	  });

	});

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'home-connect' }, function(next) {
		
		console.log('view on post');

		var newEnquiry = new Enquiry.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, zipcode, company_population, is_customer',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
				console.log('errors')
			} else {
				locals.enquirySubmitted = true;
				console.log('submitted')
			}
			next();
		});
		
	});

	view.on('init', function(next) {
		var q = keystone.list('Product').model.find().where('state', 'published');
		q.exec(function(err, results) {
			locals.data.products = results;
			next(err);
		});
	});


	
	// Render the view
	view.render('index');
	
};
