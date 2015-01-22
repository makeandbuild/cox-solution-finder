var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Industry Model
 * ==========
 */

var Industry = new keystone.List('Industry', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

var resource = {
	title: { type: String },
	icon: { type: Types.LocalFile, dest: 'public/uploads/images' },
	resource_link: { type: String, initial:false },
	description: { type: Types.Textarea, height: 100 }
}

Industry.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	heading: { type: String, required: true, default: 'Example Heading' },
	content: { type: Types.Textarea, height: 400, required: true, default: 'Example Content' },
	icon: { type: Types.LocalFile, dest: 'public/uploads/images' },
	resource_one: resource,
	resource_two: resource,
	resource_three: resource
});

Industry.relationship({ ref: 'Service', refPath: ':service', path: ':industry' });


Industry.defaultColumns = 'title, state|20%, heading|20%';
Industry.register();



//Just the model for now, more will be added later.