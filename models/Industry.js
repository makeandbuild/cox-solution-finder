var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Fields = require('./fields/fields'),
	Admin = require('./fields/admin'),
	Variables = require('./fields/variables');

/**
 * Industry Model
 * ==========
 */

var Industry = new keystone.List('Industry', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

Industry.add(

	{ heading: Admin.headers('settings') },

	{
		title: {
			type: String,
			required: true
		},
		state: Fields.state(),
		custom_ordered_services: {
			type: Types.Relationship,
			label: "Services",
			ref: 'Service',
			required: true,
			many: true,
			initial: false,
			note: "Choose 3 only."
		}
	},

	{ heading: Admin.headers('content') },

	{
		heading: {
			type: String, 
			required: true, 
			initial: false, 
			abel: "Industry Heading"
		},
		attribute_one: {
			type: String, 
			label: "Industry Attribute One"
		},
		attribute_two: {
			type: String, 
			label: "Industry Attribute Two"
		},
		attribute_three: {
			type: String, 
			label: "Industry Attribute Three"
		},
		content: {
			type: Types.Textarea, 
			height: 400, 
			required: true, 
			initial: false, 
			label: "Industry Content"
		},
		description: {
			type: String,
			required: true,
			initial: false,
			label: "Industry Description",
			note: "Text will appear on other pages linking this industry, and not the industry page itself."
		},
		svg_icon: Fields.svg_icon()
	},


	{ heading: Admin.headers('media-buffet') },

	{
		media_buffet: Fields.media_buffet()
	},


	{ heading: Admin.headers('resources') },

	{
		resource_one: 	Fields.resource(),
		resource_two: 	Fields.resource(),
		resource_three: Fields.resource(),
		resource_four: 	Fields.resource()
	}
);

Industry.relationship({ ref: 'Service', refPath: ':service', path: ':industry' });


Industry.defaultColumns = 'title, state|20%, heading|20%';
Industry.register();