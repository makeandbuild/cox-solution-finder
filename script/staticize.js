require('dotenv').load();

var debug = require('debug')('staticize')
	, s3 = require('s3')
  , req = require('request')
	,	async = require('async')
	,	url = require('url')
	,	fs = require('fs')
	, mkdirp = require('mkdirp')
	,	_ = require('underscore')

var domain = process.env.STATIC_URI
	,	sitemap = domain + 'sitemap.json'
	,	rootPath = 'public'


function s3Download(callback){

	var client = s3.createClient({
  	s3Options: {
    	accessKeyId: process.env.S3_KEY,
    	secretAccessKey: process.env.S3_SECRET,
  	},
	})

	var bucket = url.parse(process.env.S3_BUCKET)
	var eventer = client.downloadDir({
									localDir: rootPath + '/s3/',
									s3Params: {
										Bucket: bucket.host,
										Prefix: 'uploads'
									}
								})
	eventer.on('error', function(err){ callback(err) })
	eventer.on('end', function(){ callback() })
}

function getSitemap(callback){
	req({url: sitemap}, function(err, response, body){
		if (err) {
			callback(err)
		}
		callback(null, JSON.parse(body))
	})
}

function writeStaticHTML(json, callback){
	_.each(json, function(loc){
		req({url: loc}, function(err, response, body){
			var parsed = url.parse(loc)
				, path = parsed.pathname.split('/')
				, name = path.pop()

			debug(response.statusCode)
			// Rejoin to string
			path = path.join('/')

			var targetPath = rootPath + path;
			debug('targetPath: ' + targetPath);

			mkdirp(targetPath, function(err){
				if (err) {
					debug('Error making directory')
					debug(err)
					callback(err)
				}

				if (!name){
					name = "index"
				}

				debug(name)

				// Write file
				fs.writeFile(targetPath + '/' + name + '.html', body, function(err){
					if (err) {
						debug('Error writing file')
						debug(err)
						callback(err)
					} else {
						// File Saved, move on to next one.
					}
				})
			})
		})
	})
	callback()
}

async.waterfall([
	s3Download,
	getSitemap,
	writeStaticHTML
], function (err){
		if (err) {
			console.log(err)
			process.exit(1)
		}
	}
)
