// var keystone = require('keystone');
// var Connect = keystone.list('Connect');
var s3 = require('s3'),
	async = require('async'),
	_ = require('underscore'),
	url = require('url'),
	path = require('path');

function descend(obj, keyPrefix, cb) {
  for (var key in obj) {
    if (typeof(obj[key]) == "object") {
      descend(obj[key], keyPrefix.concat(key), cb)
    } else {
      cb(key, obj[key], keyPrefix.concat(key))
    }
  }
}

module.exports = function(mongoose) {
	var s3filesInUse = [];
	setImmediate(function() {

		var mongoConn = mongoose.connection;

		mongoConn.db.collections(function(err, collections) {
			if (err) {
				console.error(err)
				// mongoConn.close()
				return
			}

			async.eachSeries(collections, function(collection, next) {
				var collName = collection.collectionName

				if (collName == 'system.indexes') {
					console.log("Skipping %s", collName)
					return next()
				}

				console.log("Searching %s", collName)
				mongoConn.collection(collName).find().each(function(err, doc) {
					if (err || doc == null) {
						return next(err)
					}
					
					descend(doc, [], function(key, val, keyFull) {
						if (key == "url") {
							var path = val.replace('//s3.amazonaws.com/' + process.env.S3_BUCKET + '/', '');
							s3filesInUse.push(path);
						}
					})
				})
			}, function(err) {
				if (err) {
					console.log(err)
				}
				console.log('S3 Files In Keystone: ' + s3filesInUse.length);
				s3filesInUse = _.uniq(s3filesInUse);
				// console.log(s3filesInUse);
				console.log('S3 Files In Keystone (UNIQ): ' + s3filesInUse.length);

				var client = s3.createClient({
					s3Options: {
						accessKeyId: process.env.S3_KEY,
						secretAccessKey: process.env.S3_SECRET,
					}
				});

				var eventer = client.listObjects({s3Params:{
					Bucket: process.env.S3_BUCKET,
					Prefix: 'uploads'
					}
				});
				var s3filenames = [];
				var s3list;

				eventer.on('data', function(data) {
					s3list = data;
				})

				eventer.on('end', function() {

					for(i=0;i<s3list.Contents.length;i++) {
						var key = s3list.Contents[i]['Key'];
						s3filenames.push(key);
					}
					// console.log(s3filenames);
					console.log('S3 Files on S3: ' + s3filenames.length);

					var toBeArchived = _.difference(s3filenames, s3filesInUse);
					// console.log(toBeArchived);
					console.log('Archive Me: ' + toBeArchived.length);

					for(i=0;i<toBeArchived.length;i++) {
						var moveEventer = client.moveObject({
							Bucket: process.env.S3_BUCKET,
							CopySource: process.env.S3_BUCKET + '/' + toBeArchived[i],
							Key: toBeArchived[i].replace('uploads/', 'archive/')
						})

						moveEventer.on('end', function(data) {
							console.log('s3Cleanup moved a file');
						});
					}

				});

			})
		})		
	}, mongoose);


}
