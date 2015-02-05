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
	pageViews: { type: Types.Number },
	createdAt: { type: Date, default: Date.now }
});

Analytics.defaultSort = '-createdAt';
Analytics.defaultColumns = 'pageViews, createdAt';
Analytics.register();