var async = require('async'),
		keystone = require('keystone'),
		_ = require('underscore');


var Product 	= keystone.list('Product').model,
		Industry	= keystone.list('Industry').model,
		Service		= keystone.list('Service').model;

var domain = 'http://showroom.staging.sfv2.cox.mxmcloud.com/';
var urls = [];

exports.productURLs = function(callback) {
	var q = Product.find().where('state', 'published');

	q.exec(function(err, products){
		if (err) return callback(err) ;

		_.each(products, function(product){
				urls.push(domain + 'products/' + product.slug);
		});

		callback();
	});
}

exports.industryURLs = function(callback) {
	callback();
}

exports.serviceURLs = function(callback) {
	Service.find()
		.where('state', 'published')
		.populate('industries')
		.exec( function(err, services){
			if (err) { callback(err);}

			_.each(services, function(service){
				urls.push(domain + 'services/' + service.slug)
				_.each(service.industries, function(industry){
					urls.push(domain + 'services/' + service.slug + '/' + industry.slug);
				});
			});
			callback();
		})
}

exports.generalURLs = function(callback) {
	callback();
}


exports.sitemap = function(req, res) {
	// Reset urls otherwise the data is appended on each request.
	urls = [];

	async.series([
		exports.productURLs,
		exports.industryURLs,
		exports.serviceURLs,
		exports.generalURLs
	], function (err){
		if (err) {
			res.apiError('error', err)
		} else {
			res.apiResponse(urls)
		}
	})
}
