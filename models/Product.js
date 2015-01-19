var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Product Model
 * ==========
 */

var Product = new keystone.List('Product', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

var section = {
	title: { type: String, requred: true },
	icon: { type: Types.LocalFile, dest: 'public/uploads/images' },
	content: { type: Types.Textarea, height: 200 }
}
var resource = {
	title: { type: String },
	icon: { type: Types.LocalFile, dest: 'public/uploads/images' },
	pdf: {  type: Types.LocalFile, dest: 'public/uploads/resources' },
	description: { type: Types.Textarea, height: 100 }
}


Product.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	services: { type: Types.Relationship, ref: 'Service', required: true, many: true, initial: false },
	industries: { type: Types.Relationship, ref: 'Industry', required: true, many: true, initial: false },
	hero: { type: Types.LocalFile, dest: 'public/uploads/images'},
	resource_one: resource,
	resource_two: resource,
	resource_three: resource,
	resource_four: resource,
	
	//MAKE ME BETTER
	item_one: section,
	item_two: section,
	item_three: section,
	item_four: section,
	item_five: section,
	item_six: section
});

Product.defaultColumns = 'title, state|20%';
Product.register();