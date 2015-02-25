var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Connect Model
 * =============
 */

var Connect = new keystone.List('Connect', {
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
	nocreate: true
});

Connect.add({
	name: { type: String, required: true, index: true, noedit: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', note: "This page will not show up unless published is chosen", index: true },
	heading: { type: String, initial: false, label: "Industry Heading" },
	content: { type: Types.Textarea, height: 400, initial: false, label: "Industry Content" }
});

Connect.register();
