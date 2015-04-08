var keystone = require('keystone'),
	Connect = keystone.list('Connect'),
	Homepage = keystone.list('Homepage'),
	Industry = keystone.list('Industry'),
	Map = keystone.list('Map'),
	Partner = keystone.list('Partner'),
	Product = keystone.list('Product'),
	Service = keystone.list('Service');
	

var Models = {	'Connect': Connect,
				'Homepage': Homepage,
				'Industry': Industry,
				'Map': Map,
				'Partner': Partner,
				'Product': Product,
				'Service': Service
			};

exports = module.exports = function(req, res, next) {

	if(req.body.action == 'preview') {
		var Model = Models[req.body.key];

		var q = Model.model.findOne({
			slug: req.body.slug + '-preview'
		});

		q.exec(function(err, result) {
			var preview;
			if(result) {
				preview = result;
			} else {
				preview = new Model.model({ name : req.body.name + 'Preview'});
			}

			req.body.name = req.body.name + ' Preview';
			req.body.title = req.body.title + ' Preview';

			updater = preview.getUpdateHandler(req);

			for(key in req.body) {

				if(/_s3obj$/.test(key)) {

					s3obj = JSON.parse(req.body[key]);

					key = key.replace('_s3obj', '');

					if(!req.body[key + '_newfile']) {

						if(security.md5hash(JSON.stringify(s3obj)) == req.body[key + '_s3obj_hash']) {
							for(prop in s3obj) {
								preview[key][prop] = s3obj[prop];
							}
						} else {
							res.status(418).end('I am a tea pot.');
							return next();
						}
					}

				}

			}
			preview.save();

			updater.process(req.body, {
				flashErros: false,
				fields: Model.updateableFields,
				errorMessage: 'There was a problem with generating the preview'
			}, function(err) {
				if(err) {
					res.locals.savedPreview = false;
					req.flash('error', err);
				} else {
					res.locals.previewMode = req.body.previewMode;
					res.locals.savedPreview = true;
				}

				next(err);
			});
		});
	} else {
		next();
	}
};
