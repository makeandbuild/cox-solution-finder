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
	content: { type: Types.Textarea, wysiwyg: true, height: 200 }
}

Product.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	services: { type: Types.Relationship, ref: 'Service', required: true, many: true, initial: false },
	industries: { type: Types.Relationship, ref: 'Industry', required: true, many: true, initial: false },
	hero: { type: Types.LocalFile, dest: 'public/uploads/images'},
	//MAKE ME BETTER
	item_one: section,
	item_two: section,
	item_three: section,
	item_four: section,
	item_five: section,
	item_six: section
	// author: { type: Types.Relationship, ref: 'User', index: true },
	// publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	// tease: { type: Types.Markdown, wysiwyg: true, height: 150 , required: true, initial: false},
	// first: {
	// 	image: { type: Types.CloudinaryImage,required: true, initial: false },
	// 	content: { type: Types.Markdown, wysiwyg: true, height: 400, required: true, initial: false }
	// },
	// second: section,
	// third: section,
	//categories: { type: Types.Relationship, ref: 'ProductCategory', many: true }
});

// Product.schema.virtual('content.full').get(function() {
// 	return this.content.extended || this.content.brief;
// });

Product.defaultColumns = 'title, state|20%';
Product.register();