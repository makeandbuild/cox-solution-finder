var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Fields = require('./fields/fields'),
	Admin = require('./fields/admin'),
	Variables = require('./fields/variables');

/**
 * Homepage Model
 * =============
 */

var Homepage = new keystone.List('Homepage', {
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
	nocreate: true
});

var scene = {
	title: {
		type: Types.Text,
		label: "Showroom Stage: Scene Name"
	},
	featured_image: {
		type: Types.S3File,
		label: 'Featured Image',
		note: "Upload a 2x image. This image will display as the clicked on navigation item on the Showrooom Stage Main View",
		s3path: 'uploads/images'
	}
}
var scene_with_text = {
	title: {
		type: Types.Text,
		label: "Showroom Stage: Scene Name",
		note: "Scene will use text from the Companion Site Hero section, and the act displayed will be the Hero Video used globally."
	},
}

var map = {
	map_overlay_enable: {
		type: Types.Boolean,
		label: "Enable the following map overlay? If unchecked, map will not show.",
		default: "false"
	},
	title: {
		type: Types.Text,
		label: "Map Overlay Name"
	},
	map: {
		type: Types.S3File,
		label: 'Map Image',
		note: "Upload a 3400px by 1300px image to be the map overlay image. Image should be the map, with text and overlay, with a blurred white background.",
		s3path: 'uploads/images/map_overlays'
	},
	products: { type: Types.Relationship, label: "Related Products", note: "Choose 3 Products to show up next to the Map Overlay.", ref: 'Product', many: true, initial: false },
}

var factoid = {
	factoid_enable: {
		type: Types.Boolean,
		label: "Enable the following factoid? If unchecked, factoid will not show.",
		default: "false"
	},
	title: {
		type: Types.Text,
		label: "Factoid Name"
	},
	front_image: {
		type: Types.S3File,
		label: 'Front factoid image',
		note: "",
		s3path: 'uploads/images/factoids'
	},
	back_image: {
		type: Types.S3File,
		label: 'Back factoid image',
		note: "",
		s3path: 'uploads/images/factoids'
	}
}

Homepage.add(

	{ heading: Admin.headers('settings') },

	{
		name: {
			type: String,
			required: true,
			index: true,
			noedit: true
		}
	},

	{ heading: Admin.headers('hero') },

	{
		hero: {
			greeting: {
				type: Types.Text,
				label: "Greeting",
				note: "The word before the name of the customer when on the customized home view. For example you would enter 'Hi' and the text would read 'Hi Mark'."
			},
			business_count: {
				type: Types.Text,
				label: "Default Home Number of Business's Powered by COX Business",
				note: "The number that will appear on the default home page."
			},
			video: {
				title: { type: Types.Html,
					wysiwyg: true,
					height:40,
					label: "Hero Video: Title",
					note: "1-2 Words"
				},
				video_choice: {
					type: Types.Boolean,
					label: "Enable Video?",
					note: "If not checked, the text for SEE WHY and the play icon will not show.",
					default: "false"
				},
				video: {
					type: Types.S3File,
					label: 'Hero Video: MP4',
					note: 'MP4 Only. IMPORTANT: This will be the default video for all all industries/partners if no video is chosen.',
					allowedTypes: ['video/mp4'],
					s3path: 'uploads/videos'
				},
				video_webm: {
					type: Types.S3File,
					label: 'Hero Video: WebM',
					note: 'WebM Only. If no WebM, video may function in all browsers. Also, if no MP4 video will not be shown.',
					allowedTypes: ['video/webm'],
					s3path: 'uploads/videos'
				},
				background: {
					type: Types.S3File,
					label: 'Hero Video: Preview Image',
					note: "Upload a 2X Image to be preview image for the video.",
					s3path: 'uploads/images'
				}
			},
			background: {
				type: Types.S3File,
				label: 'Hero Background',
				note: "Upload a normal RESOLUTION SIZE image at least. Image will have a blue overlay",
				s3path: 'uploads/images'
			},
			content: {
				type: Types.Html,
				wysiwyg: true,
				height:200,
				label: "Custom Home: Content"
			}
		},

		default_heading: {
			type: Types.Textarea,
			height: 200,
			label: "Default Heading"
		},
		default_content: {
			type: Types.Textarea,
			height: 200,
			label: "Default Content"
		}
	},

	{ heading: Admin.headers('media-buffet') },
	
	{
		media_buffet: Fields.media_buffet()
	},

	{ heading: Admin.headers('connect-home') },

	{
		connect_background: {
			type: Types.S3File,
			label: 'Connect Background',
			note: "Upload a normal RESOLUTION SIZE image at least. Right side of the image will have a blue overlay",
			s3path: 'uploads/images'
		}
	},

	{ heading: Admin.headers('attract-loop') },

	{
		stage_background: {
			type: Types.S3File,
			label: 'Showroom Stage: Background',
			note: "Upload a 2x image. Image will have a white overlay",
			s3path: 'uploads/images'
		},
		stage: {
			scene_one: scene,
			scene_two: scene_with_text,
			scene_three: scene
		},
		act: {
			act_one: {
				factoid_one: factoid,
				factoid_two: factoid,
				factoid_three: factoid,
				factoid_four: factoid,
				factoid_five: factoid,
			},
			act_three: {
				map_one: map,
				map_two: map,
				map_three: map,
				map_four: map,
				map_five: map,
				map_six: map
			},
		}
	}
);

Homepage.register();
