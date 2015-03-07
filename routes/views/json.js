var util = require('util')
	, fs = require('fs')
	, async = require('async')
	,	keystone = require('keystone')
	,	_ = require('underscore')
	, mkdirp = require('mkdirp')
	, fs = require('fs')
	, nodeSES = require('node-ses');


var Product = keystone.list('Product').model
	,	Industry = keystone.list('Industry').model
	,	Service = keystone.list('Service').model
	, Enquiry = keystone.list('Enquiry');

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

function processSyncData(fn) {
	fs.readFile(fn, {encoding: 'utf8'}, function(err, content) {
		if (err) {
			console.error(err);
			return;
		}
		var data = JSON.parse(content),
				settings = {},
				enquiries = [];
		async.each(data, function(recordStr, callback) {
			var record = JSON.parse(recordStr),
					recordType = record.type;

			switch (recordType) {
				case "settings":
					settings = record.formData;
					callback();
					break;
				case "stats":
					//TODO send stats to piwik
					path = record.path;
					callback();
					break;
				case "enquiry":
					var newEnquiry = new Enquiry.model(record.formData);
					newEnquiry.save(function(err) {
						if (err) {
							console.error("Error saving %s: %s\n%j", recordType, err, record);
						} else {
							enquiries.push(newEnquiry);
						}
						callback();
					});
					break;
				default:
					console.warn("Unknown record type: %s\n%j", recordType, record);
					callback();
			}
		}, function(err) {
			if (err) {
				console.error(err);
			}

			var enquiriesCSVfn = "/uploads/enquiries-" + (new Date).getTime() + ".csv",
					enquiriesCSV = enquiries.map(function(e) { return e.toCSV(); });
			enquiriesCSV = Enquiry.CSV_HEADER + "\n" + enquiriesCSV.join("\n");

			fs.writeFile("public"+enquiriesCSVfn, enquiriesCSV, function(err) {
				if (err) {
					console.error("Error writing file %s: %s", err);
				}

				var enquiriesCSVuri = "http://dev.sfv2.cox.mxmcloud.com"+enquiriesCSVfn;
				nodeSES.createClient({
					key: process.env.SES_KEY,	secret: process.env.SES_SECRET
				}).sendemail({
					to: settings.sync_notification_email,
					from: process.env.SES_SENDER,
					cc: 'cox-sfv2@maxmedia.com',
					subject: util.format('[%s] %s', settings.showname, "Lead Information"),
					message: util.format('Lead information:<br /><br /><a href="%s" />%s</a>',
						enquiriesCSVuri, enquiriesCSVuri),
					altText: util.format("Lead information:.\n\n%s", enquiriesCSVuri)
				}, function (err, data, res) {
					if (err) {
						console.error("Error sending lead information: %s", err);
					}
				});
			});
		});
	});
}

exports.showroom_sync = function(req, res) {
	var json = req.body
		, dataDir = 'tmp/showroom-sync/'
		, outFn = dataDir + (new Date).getTime() + '.json';

	mkdirp(dataDir, function(err){
		if (err) {
			return res.json({ status: 'error', message: err })
		}

		fs.writeFile(outFn, JSON.stringify(json), function(err) {
			if (err) {
				res.json({ status: 'error', message: err })
			} else {
				setImmediate(processSyncData, outFn);
				res.json({ status: 'success', data: json })
			}
		})
 	})
}
