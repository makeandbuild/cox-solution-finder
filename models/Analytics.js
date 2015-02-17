var keystone = require('keystone'),
		Types = keystone.Field.Types,
		monitor = require('../components/monitor.js'),
		emitter = monitor.getEmitter();

/**
 * Homepage Model
 * =============
 */

var Analytics = new keystone.List('Analytics', {
	nocreate: false,
	noedit: false,
	hidden: false
});

Analytics.add({
	route: { type: String, default: '', required: true },
	archived: { type: Boolean, default: false, required: true },
	createdAt: { type: Date, default: Date.now, required: true }
});

emitter.on('connectionAvailable', function(data) {
	Analytics.model.find()
		.where('archived', false)
		.exec(function(err, analytics) {
			analytics.forEach(function(record) {
				record.update({ archived: true }, function(err, numAffected) {
					if (err) throw err;
					console.log('Analytics: ' + numAffected);
				});
			});
		});
});
monitor.start();

Analytics.defaultSort = '-createdAt';
Analytics.defaultColumns = 'route, archived, createdAt';
Analytics.register();