var util = require('util')
	, fs = require('fs')
	, async = require('async')
	, keystone = require('keystone')
	, _ = require('underscore')
	, mkdirp = require('mkdirp')
	, fs = require('fs')
	, nodeSES = require('node-ses')
	, piwik = require('piwik')
	, moment = require('moment');


var Product = keystone.list('Product').model
	,	Industry = keystone.list('Industry').model
	,	Partner = keystone.list('Partner').model
	,	Service = keystone.list('Service').model
	, Enquiry = keystone.list('Enquiry');

var domain = process.env.STATIC_URI
	, urls = [];

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

exports.partnersURLs = function(callback) {
	var q = Partner.find().where('state', 'published')

	q.exec(function(err, partners){
		if (err){
			return callback(err)
		}

		_.each(partners, function(partner){
				urls.push(domain + '/partners/' + partner.slug)
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
		exports.industryURLs,
		exports.serviceURLs,
		exports.partnersURLs,
		exports.generalURLs
	], function (err){
		if (err) {
			res.apiError('error', err)
		} else {
			res.apiResponse(urls)
		}
	})
}

function processSyncData(fn, callback) {
	var piwikClient = piwik.setup(process.env.PIWIK_URI, process.env.PIWIK_TOKEN);

	fs.readFile(fn, {encoding: 'utf8'}, function(err, content) {
		if (err) return callback(err);

		var data = JSON.parse(content),
				settings = {},
				enquiries = [];

		async.eachSeries(data, function(recordStr, next) {
			var recordType = recordStr.type;

			switch (recordType) {
				case "settings":
					settings = recordStr.formData;
					next();
					break;
				case "stats":
					piwikClient.track({
						idsite: process.env.PIWIK_SITEID,
						url: process.env.PDOMAIN + recordStr.path,
						cdt: moment(recordStr._id).format('YYYY-MM-DD HH:mm:ss'),
						_cvar: { '1': ['Platform', recordStr.device] }
					}, function(err) {
						if (err) {
							console.error("Error saving %s: %s\n%j", recordType, err, recordStr);
						}
						next();
					});
					break;
				case "enquiry":
					var newEnquiry = new Enquiry.model(recordStr.formData);
					newEnquiry.save(function(err) {
						if (err) {
							console.error("Error saving %s: %s\n%j", recordType, err, recordStr);
						} else {
							enquiries.push(newEnquiry);
						}
						next();
					});
					break;
				default:
					console.warn("Unknown record type: %s\n%j", recordType, recordStr);
					next();
			}
		}, function(err) {
			if (err) return callback(err);

			if (!enquiries.length) { // don't send email if there aren't any enquiries
				return callback();
			}

			var enquiriesCSVfn = "/uploads/enquiries-" + (new Date).getTime() + ".csv",
			enquiriesCSV = enquiries.map(function(e) { return e.toCSV(); });
			enquiriesCSV = Enquiry.CSV_HEADER + "\n" + enquiriesCSV.join("\n");

			fs.writeFile("public" + enquiriesCSVfn, enquiriesCSV, function(err) {
				if (err) return callback(err);

				var enquiriesCSVuri = process.env.PDOMAIN + enquiriesCSVfn;
				nodeSES.createClient({
					key: process.env.SES_KEY,	secret: process.env.SES_SECRET
				}).sendemail({
					to: 'taylor@makeandbuild.com',
					from: process.env.SES_SENDER,
					cc: 'taylor@makeandbuild.com',
					subject: util.format('[%s] %s', settings.showname, "Lead Information"),
					message: util.format('Lead information:<br /><br /><a href="%s" />%s</a>',
						enquiriesCSVuri, enquiriesCSVuri),
					altText: util.format("Lead information:.\n\n%s", enquiriesCSVuri)
				}, callback);
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
				setImmediate(function(fn) {
					async.waterfall([
						function(cb) {
							console.log("Processing sync %s", fn);
							cb(null, fn);
						},
						processSyncData
					], function(err) {
						if (err) {
							console.error(err);
						} else {
							console.info("sync done");
						}
					});
				}, outFn);
				res.json({ status: 'success', data: json })
			}
		})
 	})
}
