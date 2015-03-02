var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Connect Model
 * =============
 */

var Setting = new keystone.List('Setting', {
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
	nocreate: true
});

Setting.add({
	name: { type: String, required: true, index: true, noedit: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', note: "This page will not show up unless published is chosen", index: true },
});

Setting.register();
