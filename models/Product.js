var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Product = new keystone.List('Product', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

// var section = {
// 	image: { type: Types.CloudinaryImage },
// 	content: { type: Types.Markdown, wysiwyg: true, height: 400 }
// }

Product.add({
	title: { type: String, required: true },
	image: { type: Types.LocalFile, dest: 'public/uploads/images'},
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
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

Product.defaultColumns = 'title, state|20%, heading|20%';
Product.register();