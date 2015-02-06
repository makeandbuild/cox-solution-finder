var keystone = require('keystone'),
	Types = keystone.Field.Types;

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

Analytics.defaultSort = '-createdAt';
Analytics.defaultColumns = 'route, archived, createdAt';
Analytics.register();