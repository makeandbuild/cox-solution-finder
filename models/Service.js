var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Service = new keystone.List('Service', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

// var section = {
// 	image: { type: Types.CloudinaryImage },
// 	content: { type: Types.Markdown, wysiwyg: true, height: 400 }
// }

Service.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	heading: { type: String, required: true, default: 'Example Heading' },
	content: { type: Types.Textarea, height: 400, required: true, default: 'Example Content' },
	// author: { type: Types.Relationship, ref: 'User', index: true },
	// publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	// tease: { type: Types.Markdown, wysiwyg: true, height: 150 , required: true, initial: false},
	// first: {
	// 	image: { type: Types.CloudinaryImage,required: true, initial: false },
	// 	content: { type: Types.Markdown, wysiwyg: true, height: 400, required: true, initial: false }
	// },
	// second: section,
	// third: section,
	//categories: { type: Types.Relationship, ref: 'ServiceCategory', many: true }
});

// Service.schema.virtual('content.full').get(function() {
// 	return this.content.extended || this.content.brief;
// });

Service.defaultColumns = 'title, state|20%, heading|20%';
Service.register();