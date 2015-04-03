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

exports = module.exports = function(req, res) {

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
				console.log(preview);

				req.body.name = req.body.name + ' Preview';

				updater = preview.getUpdateHandler(req);

				updater.process(req.body, {
					flashErros: false,
					fields: Model.updateableFields,
					errorMessage: 'There was a problem with generating the preview'
				}, function(err) {
						if(err) {
							return res.apiResponse({ success: false, err: err });
						}
						return res.apiResponse({ success: true });
				});
			});
		}

};
