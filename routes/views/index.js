var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry'),
	security = require('../../components/security.js'),
	mongoose = require('mongoose');

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
	
	var encrypted_uid;


	if(locals.uid != undefined) {
		encrypted_uid = locals.uid;
	} else if(req.cookies.UID != undefined) {
		encrypted_uid = req.cookies.UID;
	} else {
		encrypted_uid = false;
	}

	// if (encrypted_uid && req.params.enquiry) { //IS COOKIE THERE?
	// 	console.log(111);
	// 	res.redirect('/');
	// } 
	var uid = security.decrypt(encrypted_uid);
	var objid = null;
 	if(uid.length == 12 || uid.length == 24) {
 		objid = new mongoose.Types.ObjectId(uid);
 	}

	if (objid !== null) {

		var q = keystone.list('Enquiry').model.findOne({'_id': objid});
		var user;
		q.exec(function(err, results) {
			if(results !== null) {
				locals.data.custom_data = {};
				user = results;

				//PUT ENQUIRY IN THERE
				//Fake Data
				locals.data.custom_data.name = {};
				locals.data.custom_data.name.first = user.name.first;
				locals.data.custom_data.eventName = user.showroom;

				locals.data.custom_data.favorites = {};

				if(user.industries != undefined) { 
					user.industries_array = user.industries.split(",");
				} else {
					user.industries_array = false;
				}

				if(user.services != undefined) { 
					user.services_array = user.services.split(",");
				} else {
					user.services_array = false;
				}

				if(user.products != undefined) { 
					user.products_array = user.products.split(",");
				} else {
					user.products_array = false;
				}

				locals.data.custom_data.favorites.industries = user.industries_array;
				locals.data.custom_data.favorites.services = user.services_array;
				locals.data.custom_data.favorites.products = user.products_array;
			}
		});

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
