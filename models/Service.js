var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Service Model
 * ==========
 */

var Service = new keystone.List('Service', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});


Service.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	icon: { type: Types.LocalFile, dest: 'public/uploads/images' },
	heading: { type: String, required: true, default: 'Example Heading' },
	content: { type: Types.Textarea, height: 400, required: true, default: 'Example Content' },
	industries: { type: Types.Relationship, ref: 'Industry', required: true, many: true, initial: false }
});

Service.defaultColumns = 'title, state|20%, heading|20%';
Service.register();