var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry'),
	security = require('../../components/security.js'),
	mongoose = require('mongoose');

function removeDuplicates(data_products){
	var seen = {};
	var out = [];
	var len = data_products.length;
	var j = 0;
	for(var i = 0; i < len; i++) {
		var item = data_products[i];
		if(item != undefined){
			if(seen[item.slug] !== 1) {
				seen[item.slug] = 1;
				out[j] = item;
				j++;
			}
		}
	}
	return out;
}

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
	locals.data.custom_data = {};
	locals.data.custom_data.is_custom = false;
	locals.data.custom_data.has_favorites = false;
	locals.data.products = [];
	var product_in_industries, product_in_services, product_selected, allProducts = [];

	var uid = false;
	try {
		if(locals.uid != undefined) {
			uid = security.decrypt(locals.uid);
		} else if(req.cookies.UID != undefined) {
			uid = security.decrypt(req.cookies.UID);
		}
	} catch (e) {
		console.error("Error attempting to decrypt UID");
		console.error(e);
	}

	var objid = null;
	if (uid && (uid.length == 12 || uid.length == 24)) {
		objid = new mongoose.Types.ObjectId(uid);
	}

	if (objid !== null) {

		var q = keystone.list('Enquiry').model.findOne({'_id': objid});
		var user;
		q.exec(function(err, results) {

			if(results !== null) {
				user = results;

				var has_favorites = false;
				//PUT ENQUIRY IN THERE
				console.log(user);

				//Fake Data
				locals.data.custom_data.is_custom = true;
				locals.data.custom_data.name = {};
				locals.data.custom_data.name.first = user.name.first;
				locals.data.custom_data.eventName = user.showroom;

				locals.data.custom_data.favorites = {};

				if(user.industries != undefined && user.industries != false && user.industries != null && user.industries != "") {
					user.industries_array = user.industries.split(",");
					has_favorites = true;
				} else {
					user.industries_array = false;
				}

				if(user.partners != undefined && user.partners != false && user.partners != null && user.partners != "") {
					user.partners_array = user.partners.split(",");
					has_favorites = true;
				} else {
					user.partners_array = false;
				}

				if(user.services != undefined && user.services != false && user.services != null && user.services != "") {
					user.services_array = user.services.split(",");
					has_favorites = true;
				} else {
					user.services_array = false;
				}

				if(user.products != undefined && user.products != false && user.products != null && user.products != "") {
					user.products_array = user.products.split(",");
					has_favorites = true;
				} else {
					user.products_array = false;
				}

				if(has_favorites == true){
					locals.data.custom_data.has_favorites = true;
				}

				locals.data.custom_data.favorites.industries = user.industries_array;
				locals.data.custom_data.favorites.partners = user.partners_array;
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

	view.on('init', function(next) {

		var q = keystone.list('Map').model.find()
			.where('state', 'published')
			.populate('products')
			.sort('slug');

		q.exec(function(err, result) {
			locals.data.regional_maps = result;
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
		if (locals.data.custom_data.has_favorites && locals.data.custom_data.favorites.services){
			var qu = keystone.list('Service').model.find()
			.where('state', 'published')
			.where('slug').in(locals.data.custom_data.favorites.services);
			qu.exec(function(err, results) {
				locals.data.services = results;
				next(err);
			});
		} else {
			next();
		}
	});

	view.on('init', function(next) {
		if (locals.data.custom_data.has_favorites && locals.data.custom_data.favorites.industries){
			var qu = keystone.list('Industry').model.find()
			.where('state', 'published')
			.where('slug').in(locals.data.custom_data.favorites.industries);
			qu.exec(function(err, results) {
				locals.data.industries = results;
				next(err);
			});
		} else {
			next();
		}
	});

	view.on('init', function(next) {
		if (locals.data.custom_data.has_favorites && locals.data.custom_data.favorites.partners){
			var qu = keystone.list('Partner').model.find()
			.where('state', 'published')
			.where('slug').in(locals.data.custom_data.favorites.partners);
			qu.exec(function(err, results) {
				locals.data.partners = results;
				next(err);
			});
		} else {
			next();
		}
	});

	view.on('init', function(next) {
		if (locals.data.custom_data.has_favorites){

			/*
				Get all 3 types of ways to show products,
				then go thru the queries, call a function
				to remove duplicates, and set the data.

				The reason there are so many promises is that
				by the time the queries were all done, if you set
				the data it would occur too late because everything
				is asynchronous and the queries took too long.

				There is also a case where an undefined object slips
				in, so my future self, or you, should find that and fix it.
				I've checked for the undefined object at the function at the
				top of the page.
			*/

			var productIndustryQuery = keystone.list('Product').model.find()
			.populate('industries')
			.where('state', 'published')
			.where('industries').in(locals.data.industries).sort('order');

			var productServicesQuery = keystone.list('Product').model.find()
			.populate('services')
			.where('state', 'published')
			.where('services').in(locals.data.services).sort('order');

			var productSelected = keystone.list('Product').model.find()
			.where('state', 'published')
			.where('slug').in(locals.data.custom_data.favorites.products).sort('order');

			productIndustryQuery.exec(function(err, results) {
				allProducts = allProducts.concat(results);
				locals.data.products = removeDuplicates(allProducts.concat(results));
			}).then(function(){
		        productServicesQuery.exec(function(err, results) {
					allProducts = allProducts.concat(results);
					locals.data.products = removeDuplicates(allProducts.concat(results));
				}).then(function(){
			        productSelected.exec(function(err, results) {
        	        	locals.data.products = removeDuplicates(allProducts.concat(results));
        	        	next();
        			});
				}, function(err){
			       productSelected.exec(function(err, results) {
	       	        	locals.data.products = removeDuplicates(allProducts.concat(results));
	       	        	next();
	       			});
				});
			}, function(err){
		        productServicesQuery.exec(function(err, results) {
					allProducts = allProducts.concat(results);
					locals.data.products = removeDuplicates(allProducts.concat(results));
				}).then(function(){
			        productSelected.exec(function(err, results) {
        	        	locals.data.products = removeDuplicates(allProducts.concat(results));
        	        	next();
        			});
				}, function(err){
			       productSelected.exec(function(err, results) {
	       	        	locals.data.products = removeDuplicates(allProducts.concat(results));
	       	        	next();
	       			});
				});
			});

		} else {
			next();
		}


	});



	// Render the view
	view.render('index');

};
