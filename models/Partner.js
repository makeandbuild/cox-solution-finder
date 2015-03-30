var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Fields = require('./fields/fields'),
	Admin = require('./fields/admin'),
	Variables = require('./fields/variables');

/**
 * Partners Model
 * ==========
 */

var Partner = new keystone.List('Partner', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

Partner.add(

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
		},
		heading: {
			type: String,
			initial: false,
			label: "Partner Heading"
		},
		content: {
			type: Types.Textarea,
			height: 400, initial: false,
			label: "Partner Content"
		},
		description: {
			type: String,
			initial: false,
			label: "Partner Description",
			note: "Text will appear on other pages linking this partner, and not the partner page itself."
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

Partner.relationship({ ref: 'Service', refPath: ':service', path: ':industry' });


Partner.defaultColumns = 'title, state|20%, heading|20%';
Partner.register();