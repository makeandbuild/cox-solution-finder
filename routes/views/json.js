var async = require('async')
	,	keystone = require('keystone')
	,	_ = require('underscore')
	, mkdirp = require('mkdirp')
	, fs = require('fs')


var Product 	= keystone.list('Product').model
	,	Industry	= keystone.list('Industry').model
	,	Service		= keystone.list('Service').model

var domain = process.env.STATIC_URI
	, urls = []

exports.productURLs = function(callback) {
	var q = Product.find().where('state', 'published')

	q.exec(function(err, products){
		if (err){
			return callback(err)
		}

		_.each(products, function(product){
				urls.push(domain + '/products/' + product.slug)
		})

		callback()
	})
}

exports.industryURLs = function(callback) {
	var q = Industry.find().where('state', 'published')

	q.exec(function(err, industries){
		if (err){
			return callback(err)
		}

		_.each(industries, function(industry){
				urls.push(domain + '/industries/' + industry.slug)
		})

		callback()
	})
}

exports.serviceURLs = function(callback) {
	Service.find()
		.where('state', 'published')
		.populate('industries')
		.exec( function(err, services){
			if (err) {
				return callback(err)
			}

			_.each(services, function(service){
				urls.push(domain + '/services/' + service.slug)
				_.each(service.industries, function(industry){
					urls.push(domain + '/services/' + service.slug + '/' + industry.slug)
				})
			})
			callback()
		})
}

exports.generalURLs = function(callback) {
	urls.push(domain + '/')
	urls.push(domain + '/connect')
	urls.push(domain + '/settings')
	callback()
}


exports.sitemap = function(req, res) {
	// Reset urls otherwise the data is appended on each request.
	urls = []

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

exports.showroom_sync = function(req, res) {
	var json = req.body
		, name = (new Date).getTime()
		, dataDir = 'tmp/showroom-sync/'

	mkdirp(dataDir, function(err){
		if (err) {
			return res.json({ status: 'error', message: err })
		}

		fs.writeFile(dataDir + name + '.json', JSON.stringify(json), function(err){
			if (err) {
				res.json({ status: 'error', message: err })
			} else {
				res.json({ status: 'success', data: json })
			}
		})
 	})
}




