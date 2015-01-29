var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Homepage Model
 * =============
 */

var Homepage = new keystone.List('Homepage', {
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
	nocreate: true
});


Homepage.add({
	name: { type: String, required: true, index: true, noedit: true },

	//Hero Area
	hero: {
		business_count: { type: Types.Text, label: "Default Home Number of Business's Powered by COX Business", note: "The number that will appear on the default home page." },
		video: {
			type: Types.S3File,
			label: 'Default Home: Hero Video',
			note: 'MP4 Only',
			allowedTypes: ['video/mp4'],
			s3path: 'uploads/videos'
		},
		background: {
			type: Types.S3File,
			label: 'Hero Background',
			note: "Upload a normal RESOLUTION SIZE image at least. Image will have a blue overlay",
			s3path: 'uploads/images'
		},
		content: { type: Types.Html, wysiwyg: true, height:200, label: "Custom Home: Content" }
	},

	default_heading: { type: Types.Textarea, height: 200, label: "Default Heading" },
	default_content: { type: Types.Textarea, height: 200, label: "Default Content" },
});

Homepage.register();
